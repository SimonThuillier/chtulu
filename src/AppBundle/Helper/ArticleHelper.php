<?php

namespace AppBundle\Helper;

use Symfony\Component\Serializer\SerializerInterface;
use AppBundle\DTO\ArticleCollectionDTO;
use AppBundle\DTO\ArticleModalDTO;
use AppBundle\Factory\ArticleDTOFactory;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Doctrine\Common\Annotations\AnnotationReader;

class ArticleHelper
{
    
    /** @var SerializerInterface $serializer */
    private $serializer;
    /** @var ArticleDTOFactory $articleDTOFactory */
    private $articleDTOFactory;
    
    public function __construct(SerializerInterface $serializer,ArticleDTOFactory $articleDTOFactory)
    {
        $this->serializer = $serializer;
        $this->articleDTOFactory = $articleDTOFactory;
    }
    
    /**
     * @param string $subEvents
     * @return array
     */
    public function deserializeSubEvents($subEvents)
    {
        /** @var ArticleCollectionDTO $articleCollectionDTO */
        $articleCollectionDTO = $this->serializer->deserialize($subEvents, ArticleCollectionDTO::class, 'json');
        
        /** @var array $articleModalDTOs */
        $articleModalDTOs = [];
        
        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $normalizer = new ObjectNormalizer($classMetadataFactory);
        /*$normalizer->setCircularReferenceLimit(1);
        // Add Circular reference handler
        $normalizer->setCircularReferenceHandler(function ($object) {
            return $object->getId();
        });*/
            $normalizers = array($normalizer);
            $serializer = new Serializer($normalizers,array(new JsonEncoder()));
        
        
        foreach ($articleCollectionDTO->data as $item){
            $articleModalDTO = $this->articleDTOFactory->newInstance("modal");
            
            $articleModalDTO = $serializer->denormalize($item, ArticleModalDTO::class);
            
            $data = $serializer->normalize($articleModalDTO,null,array('groups' => array('group1')));
            
            // $itemDecoded = $serializer->decode($item, 'json');
            //$item = $serializer->encode($item, 'json');
            
            return  $serializer->encode($data, 'json') ;
            $articleModalDTOs[] = $this->serializer->deserialize($item, ArticleModalDTO::class, 
                'json',array('object_to_populate' => $articleModalDTO,'allow_extra_attributes' => true));
        }
        
        return $articleModalDTOs;
    }
    
    
    
    
    
    
    
    
    
    
}