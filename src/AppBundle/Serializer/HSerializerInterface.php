<?php

namespace AppBundle\Serializer;

interface HSerializerInterface
{
    /**
     * returns admissible class names of objects operated by the serializer
     * first className is the class of object created during deserialization
     * @return array
     */
    public function getClassNames();
    
    /**
     * @param mixed $object
     * @return string
     * @throws SerializationException
     */
    public function serialize($object);

    /**
     * @param mixed $object
     * @return array
     * @throws SerializationException
     */
    public function normalize($object);

    /**
     * @param array $normalizedObject
     * @return string
     * @throws SerializationException
     */
    public function encode($normalizedObject);

    /**
     * @param string $payload 
     * @return mixed
     * @throws DeserializationException
     */
    public function deserialize($payload);

    /**
     * @param string $payload
     * @return array
     * @throws DeserializationException
     */
    public function decode($payload);

    /**
     * @param array $normalizedPayload
     * @return mixed
     * @throws DeserializationException
     */
    public function denormalize($normalizedPayload);



}