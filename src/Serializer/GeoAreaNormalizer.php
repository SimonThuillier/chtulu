<?php
namespace App\Serializer;

use App\Util\GeoArea;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class GeoAreaNormalizer implements NormalizerInterface,DenormalizerInterface
{
    /**
     */
    public function __construct()
    {
    }

    public function supportsNormalization($data, $format = null)
    {
        return is_object($data) && get_class($data) === GeoArea::class;
    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        return $type === GeoArea::class ||
            (is_array($data) && isset($data['center']) && isset($data['zoom']))
            || (is_object($data) && get_class($data) === GeoArea::class);
    }

    /**
     * @param GeoArea $object
     * @param array|null $groups
     * @param array $context
     * @return array
     * @throws InvalidArgumentException
     */
    public function normalize($object,$groups=null,array $context=[])
    {
        try{
            $normalization = [
                'center' => ($object->getCenter()),
                'zoom' => ($object->getZoom() )
                ]
            ;
        }
        catch(\Exception $e){
            throw new InvalidArgumentException("Error while normalizing object of class " .
                get_class($object) . " :  " . $e->getMessage());
        }
        return $normalization;
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
        if ($data === null) return null;
        if(is_object($data)) return $data;
        try{
            // put specific operations here if needed
        }
        catch(\Exception $e){
            throw new InvalidArgumentException("Invalid argument for transformation while denormalizing to " .
                GeoArea::class . " :  " . $e->getMessage());
        }
        try{
            $object = new GeoArea();
            $object
                ->setCenter($data["center"])
                ->setZoom($data["zoom"]);
        }
        catch(\Exception $e){
            throw new InvalidArgumentException("Error while denormalizing onto '" .
                GeoArea::class . "' object :  " . $e->getMessage());
        }
        return $object;
    }
}