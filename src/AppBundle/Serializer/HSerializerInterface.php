<?php

namespace AppBundle\Serializer;

interface HSerializerInterface
{
    /**
     * returns class name of object operated by the serializer
     * @return string
     */
    public function getClassName();
    
    /**
     * @param mixed $payload
     * @return string
     */
    public function serialize($object);
    /**
     * @param string $payload 
     * @return mixed
     */
    public function deserialize($payload);    
}