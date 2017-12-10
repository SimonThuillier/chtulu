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
     * @var string
     */
    protected $className;
    
    /**
     * @var string
     */
    protected $payload;
    /**
     * @var array
     */
    protected $array;
    /**
     * @var mixed
     */
    protected $object;

    
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
    public function getClassName(){
       return $this->className;
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \AppBundle\Serializer\HSerializerInterface::deserialize()
     */
    public function decode($payload){
        $this->payload = $payload;
        $this->array = $this->serializer->decode($payload, 'json');
        return $this->array;
    }
}