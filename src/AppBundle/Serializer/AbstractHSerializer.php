<?php

namespace AppBundle\Serializer;

use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Doctrine\ORM\Mapping\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Doctrine\Common\Annotations\AnnotationReader;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

abstract class AbstractHSerializer implements HSerializerInterface
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
     * @var mixed $mainFactory
     */
    protected $mainFactory;
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
     * @param SerializerInterface $serializer
     * @param mixed $mainFactory
     */
    public function __construct(ManagerRegistry $doctrine,
        SerializerInterface $serializer,$mainFactory)
    {
        $this->doctrine = $doctrine;
        $this->serializer = $serializer;
        
        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $encoders = array(new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $this->serializer = new Serializer($normalizers,$encoders);
        $this->mainFactory = $mainFactory;
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \AppBundle\Serializer\HSerializerInterface::getClass()
     */
    public function getClassNames(){
       return $this->classNames;
    }

    /**
     * {@inheritdoc}
     * @see \AppBundle\Serializer\HSerializerInterface::serialize()
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
        return json_encode($normalizedObject);
    }

    /**
     * {@inheritdoc}
     * @see \AppBundle\Serializer\HSerializerInterface::deserialize()
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