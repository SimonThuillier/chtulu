<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 00:53
 */

namespace AppBundle\Form\DataTransformer;

use AppBundle\Serializer\GeoJsonNormalizer;
use AppBundle\Utils\Geometry;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Serializer;


class GeoJsonTransformer implements DataTransformerInterface
{
    /**
     * @var Serializer
     */
    private $serializer;

    public function __construct(GeoJsonNormalizer $normalizer,JsonEncoder $encoder)
    {
        $this->serializer = new Serializer([$normalizer],[$encoder]);
    }

    /**
     * @param  Geometry|null $object
     * @return string
     * @throws TransformationFailedException
     */
    public function transform($object)
    {
        if (null === $object) return '';

        try{
            $payload = $this->serializer->serialize($object,'json');
        }
        catch(\Exception $e){
            throw new TransformationFailedException($e->getMessage());
        }
        return $payload;
    }

    /**
     * @param  string $payload
     * @return Geometry|null
     * @throws TransformationFailedException
     */
    public function reverseTransform($payload)
    {
        if (null === $payload || $payload === "") return null;
        try{
            if(is_string($payload)) $object = $this->serializer->deserialize($payload,null,'json');
        }
        catch(\Exception $e){
            throw new TransformationFailedException($e->getMessage());
        }
        return $object;
    }

}