<?php
namespace App\Serializer;

use Symfony\Component\Serializer\Exception\InvalidArgumentException;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use App\Util\HDate;
use App\Helper\DateHelper;
use App\Entity\DateType;

class DateNormalizer implements NormalizerInterface,DenormalizerInterface
{

    public function __construct()
    {
    }

    public function supportsNormalization($data, $format = null)
    {
        return is_object($data) && get_class($data) === \DateTime::class;
    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        return false;
    }

    /**
     * @param \DateTime|null $object
     * @param array|null $groups
     * @param array $context
     * @return array
     * @throws InvalidArgumentException
     */
    public function normalize($object,$groups=null,array $context=[])
    {
        if($object === null) return null;
        /** @var \DateTime $object */
        return "#DATE#" . $object->setTimezone(new \DateTimeZone("UTC"))->format("Y-m-d#H:i:s#");
    }

    /**
     * @param mixed $data
     * @param string $class
     * @param null $format
     * @param array $context
     * @return mixed
     * @throws InvalidArgumentException
     */
    public function denormalize($data, $class, $format = null, array $context = array())
    {
        return null;
    }
}