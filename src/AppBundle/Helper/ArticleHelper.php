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
use AppBundle\Serializer\HDateSerializer;

class ArticleHelper
{
    
    /** @var SerializerInterface $serializer */
    private $serializer;
    /** @var ArticleDTOFactory $articleDTOFactory */
    private $articleDTOFactory;
    /**@var HDateSerializer*/
    private $hDateSerializer;
    
    public function __construct(ArticleDTOFactory $articleDTOFactory,HDateSerializer $hDateSerializer)
    {
        $this->articleDTOFactory = $articleDTOFactory;
        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $normalizer = new ObjectNormalizer($classMetadataFactory);
        $this->serializer = new Serializer(array($normalizer),array(new JsonEncoder()));
        $this->hDateSerializer = $hDateSerializer;
    }
    
    /**
     * @param ArticleCollectionDTO $articleDTO
     * @return void
     */
    public function deserializeSubEvents($articleDTO)
    {
        $this->serializer->deserialize($articleDTO->subEvents, ArticleCollectionDTO::class, 'json',
            array('object_to_populate' => $articleDTO,'allow_extra_attributes' => true));
        $articleDTO->subEvents = null;
        
        $processedCount = 0;
        $subEventsArray = [];
        foreach ($articleDTO->subEventsArray as $item){
            $articleModalDTO = $this->articleDTOFactory->newInstance("modal");
            $this->serializer->denormalize($item, ArticleModalDTO::class, 
                'json',array('object_to_populate' => $articleModalDTO,'allow_extra_attributes' => true));
            $subEventsArray[] = $articleModalDTO;
            $processedCount++;
        }
        $articleDTO->subEventsArray = $subEventsArray;
        return $processedCount == $articleDTO->subEventsCount;
    }
    
    /**
     * @param ArticleCollectionDTO $articleDTO
     * @return void
     */
    public function serializeSubEvents($articleDTO)
    {
        $articleDTO->subEvents = $this->serializer->serialize([
            'subEventsCount' => $articleDTO->subEventsCount,
            'subEventsArray' => $articleDTO->subEventsArray], 'json');
    }
    
    
    /**
     * 
     * @param ArticleAbstractDTO $articleDTO
     */
    public function handleDTODates($articleDTO)
    {
        $this->handleDTODate($articleDTO, "begin");
    }
    
    /**
     *
     * @param ArticleAbstractDTO $articleDTO
     * @param string $prefix
     */
    private function handleDTODate($articleDTO,$prefix)
    {
        $hDateAttr = $prefix . 'HDate';
        $hDate = $articleDTO->$hDateAttr;
        $labelAttr = $prefix . 'DateLabel';
        $label = $articleDTO->$labelAttr;
        
        
        if($hDate === null && $label !== null){
            $hDate = $this->hDateSerializer->deserialize($label);
            $articleDTO->$hDateAttr = $hDate;
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    
}