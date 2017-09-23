<?php
namespace AppBundle\Factory;

use AppBundle\Entity\Article;
use AppBundle\DTO\ArticleMainDTO;

class ArticleFactory  extends AbstractEntityFactory
{
    /**
     * Help to set data in the method newInstance in AbstractEntityFactory
     * @param $dto
     * @return Article
     */
    public function newInstance($dto)
    {
        parent::newInstance($dto);
        $this->entity->setCreationDate(new \DateTime());
        $this->setData();
        return $this->entity;
    }
    
    
    public function setData()
    {
        /** @var Article $article  */
        $article = $this->entity;
        /** @var ArticleModalDTO $dto */
        $dto = $this->dto;
        $article->setTitle($dto->title);
        $article->setAbstract($dto->abstract);
        $article->setType($dto->type);
        $article->setSubType($dto->type);
        if($dto->isBeginDateApprox){
            $article->setMinBeginDate($dto->minBeginDate);
            $article->setMaxBeginDate($dto->maxBeginDate);
        }
        if(! $dto->hasNotEndDate){
            $article->setMaxEndDate($dto->endDate);
            if($dto->isEndDateApprox){
                $article->setMinEndDate($dto->minEndDate);
                $article->setMaxEndDate($dto->maxEndDate);
            }
        }
    }
}