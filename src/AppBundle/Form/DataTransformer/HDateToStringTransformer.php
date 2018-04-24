<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 00:53
 */

namespace AppBundle\Form\DataTransformer;

use AppBundle\Serializer\DeserializationException;
use AppBundle\Serializer\HDateSerializer;
use AppBundle\Serializer\SerializationException;
use AppBundle\Utils\HDate;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;


class HDateToStringTransformer implements DataTransformerInterface
{
    /**
     * @var HDateSerializer
     */
    private $serializer;

    public function __construct(HDateSerializer $serializer)
    {
        $this->serializer = $serializer;
    }

    /**
     * @param  HDate|null $object
     * @return string
     * @throws TransformationFailedException
     */
    public function transform($object)
    {
        if (null === $object) {
            return '';
        }
        try{
            $payload = $this->serializer->serialize($object);
        }
        catch(SerializationException $e){
            throw new TransformationFailedException($e->getMessage());
        }
        return $payload;
    }

    /**
     * @param  string $payload
     * @return HDate|null
     * @throws TransformationFailedException
     */
    public function reverseTransform($payload)
    {
        if (null === $payload || $payload === "") {
            return null;
        }

        try{
            if(is_string($payload)) $payload = $this->serializer->decode($payload);
            $object = $this->serializer->denormalize($payload);
        }
        catch(DeserializationException $e){
            throw new TransformationFailedException($e->getMessage());
        }
        return $object;
    }

}