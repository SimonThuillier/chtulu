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
        if($data === null || empty($data) || !is_string($data)){
            if(preg_match('/\\\DateTime$/',$type)) return true;
            else return false;
        }
        $supports = preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/',$data);
        return $supports;
    }

    /**
     * @param \DateTime|null $object
     * @param array|null $groups
     * @param array $context
     * @return string
     * @throws InvalidArgumentException
     */
    public function normalize($object,$groups=null,array $context=[])
    {
        if($object === null) return null;
        /** @var \DateTime $object */
        return "#DATE#" . $object->setTimezone(new \DateTimeZone("UTC"))->format("Y-m-d\TH:i:s\Z") . "#";
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
        if($data === null || empty($data)) return null;
        $matches = [];
        $supports = preg_match('/^(?<iso>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?<millis>\.\d+)?Z$/',$data,$matches);
        if(!$supports) return null;

        $isoString = $matches['iso'] . 'Z';
        $date = \DateTime::createFromFormat(\DateTime::ISO8601, $isoString);
        if(! $date instanceof \DateTime) return null;

        return $date;
    }
}