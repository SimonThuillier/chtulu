<?php
namespace AppBundle\Factory;

use AppBundle\Entity\Article;
use AppBundle\DTO\ArticleMainDTO;

class ArticleFactory  extends AbstractEntityFactory
{
    /**
     * Help to set data in the method newInstance in AbstractEntityFactory
     */
    public function setData()
    {
        /** @var Article $this->entity  */
        /** @var ArticleMainDTO $this->dto */
        //$this->entity = new Article();
        //$this->dto = new ArticleMainDTO();
        $this->entity->setTitle($this->dto->title);
        $this->entity->setAbstract($this->dto->abstract);
        $this->entity->setType($this->dto->type);
        $this->entity->setSubType($this->dto->type);
        if($this->dto->isBeginDateApprox){
            $this->entity->setMinBeginDate($this->dto->minBeginDate);
            $this->entity->setMaxBeginDate($this->dto->maxBeginDate);
        }
        if(! $this->dto->hasNotEndDate){
            $this->entity->setMaxEndDate($this->dto->endDate);
            if($this->dto->isEndDateApprox){
                $this->entity->setMinEndDate($this->dto->minEndDate);
                $this->entity->setMaxEndDate($this->dto->maxEndDate);
            }
        }
        $this->entity->setCreationDate(new \DateTime());
    }
}