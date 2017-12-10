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
        $normalizer = new ObjectNormalizer(null);
        $this->serializer = new Serializer(array($normalizer),array(new JsonEncoder()));
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
    public function deserialize($payload){
        $this->payload = $payload;
        $this->object = new $this->className();
        $this->serializer->denormalize($this->payload, $this->className,
            'json',array('object_to_populate' => $this->object,'allow_extra_attributes' => true));
        
        return $this->object;
    }
}