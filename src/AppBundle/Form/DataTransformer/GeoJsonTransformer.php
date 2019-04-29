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
use Symfony\Component\Serializer\Encoder\EncoderInterface;
use Symfony\Component\Serializer\Serializer;


class GeoJsonTransformer implements DataTransformerInterface
{
    /**
     * @var Serializer
     */
    private $serializer;

    public function __construct(GeoJsonNormalizer $normalizer,EncoderInterface $encoder)
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
        $truc = $this->serializer->supportsDenormalization($payload,null);
        $lol = "lol";
        if (null === $payload || $payload === "") return null;
        if(! $this->serializer->supportsDenormalization($payload,null)){
            throw new TransformationFailedException("Unsupported denormalization to Geometry for this data");
        }
        try{
            return $this->serializer->denormalize($payload,null,'json');
        }
        catch(\Exception $e){
            throw new TransformationFailedException($e->getMessage());
        }

    }

}