<?php

namespace AppBundle\Serializer;

use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Serializer\Normalizer\PropertyNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Doctrine\Common\Annotations\AnnotationReader;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

abstract class AbstractHSerializer implements HSerializer
{
    /**
     * @var ManagerRegistry
     */
    protected $doctrine;
    /** 
     * @var SerializerInterface $serializer
     *  */
    protected $serializer;
    /**
     * 
     * @var array
     */
    protected $classNames;
    
    /**
     * @var string
     */
    protected $payload;
    /**
     * @var array
     */
    protected $normalization;
    /**
     * @var mixed
     */
    protected $object;
    /**
     * @var array
     */
    protected $mandatoryKeys;

    /**
     * 
     * @param ManagerRegistry $doctrine
     */
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;

        $encoders = array(new JsonEncoder());
        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $normalizers = array(new PropertyNormalizer($classMetadataFactory),new ObjectNormalizer());
        $this->serializer = new Serializer($normalizers,$encoders);
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \AppBundle\Serializer\HSerializer::getClass()
     */
    public function getClassNames(){
       return $this->classNames;
    }

    /**
     * {@inheritdoc}
     * @see \AppBundle\Serializer\HSerializer::serialize()
     * @param mixed $object
     * @throws SerializationException
     */
    public function serialize($object)
    {
        return $this->encode($this->normalize($object));
    }

    /**
     * @param mixed $object
     * @return void
     * @throws SerializationException
     */
    protected function preCheckNormalize($object)
    {
        if(!in_array(get_class($object),$this->classNames)){
            throw new SerializationException("Unable to serialize : " .
                get_class($object) . " given and " . join('|',$this->classNames) . " required");
        }
    }

    /**
     * @param array $normalizedObject
     * @return string
     */
    public function encode($normalizedObject){
        return $this->serializer->encode($normalizedObject,'json');
        //return json_encode();
    }

    /**
     * {@inheritdoc}
     * @see \AppBundle\Serializer\HSerializer::deserialize()
     * @param string $object
     * @throws DeserializationException
     */
    public function deserialize($payload)
    {
        return $this->denormalize($this->decode($payload));
    }

    /**
     * @param mixed $normalizedPayload
     * @return void
     * @throws DeserializationException
     */
    protected function preCheckDenormalize($normalizedPayload)
    {
        foreach($this->mandatoryKeys as $key){
            if(! array_key_exists($key,$normalizedPayload)){
                throw new DeserializationException("Unable to deserialize : key '" . $key . "' is missing in data payload");
            }
        }
    }

    /**
     * @param string $payload
     * @return array|mixed
     */
    public function decode($payload){
        return $this->serializer->decode($payload, 'json');
    }



}