<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 07/04/18
 * Time: 20:05
 */

namespace App\Serializer;


use Symfony\Component\Serializer\Normalizer\NormalizerInterface;


class MediatorNormalizer implements NormalizerInterface
{
    /**
     * handles mediator object which should not be serialized
     * MediatorNormalizer constructor.
     */
    public function __construct()
    {

    }

    public function supportsNormalization($data, $format = null)
    {
        return (is_object($data) && strpos(strtoupper(get_class($data)),"MEDIATOR") !== false);

    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        return false;
    }

    /**
     * @inheritdoc
     */
    public function normalize($object,$groups=null,array $context=[])
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public function denormalize($data, $class, $format = null, array $context = array())
    {
        return $data;
    }
}