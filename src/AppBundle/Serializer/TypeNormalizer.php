<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 07/04/18
 * Time: 20:05
 */

namespace AppBundle\Serializer;


use Symfony\Component\Serializer\Normalizer\NormalizerInterface;


class TypeNormalizer implements NormalizerInterface
{
    /**
     * handles type entities which are always normalized the same way
     * MediatorNormalizer constructor.
     */
    public function __construct()
    {

    }

    public function supportsNormalization($data, $format = null)
    {
        return (is_object($data) && strpos(strtoupper(get_class($data)),"TYPE") !== false);

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
        return ["id" => $object->getId(),"label" => $object->getLabel()];
    }

    /**
     * @inheritdoc
     */
    public function denormalize($data, $class, $format = null, array $context = array())
    {
        return $data;
    }
}