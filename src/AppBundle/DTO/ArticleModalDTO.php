<?php

namespace AppBundle\DTO;

use AppBundle\Entity\ArticleType;
use AppBundle\Entity\ArticleSubType;
use Symfony\Component\Serializer\Annotation\Groups;
use AppBundle\Entity\Article;
use AppBundle\Entity\ArticleLink;


/**
 * 
 * @author belze
 * DTO for handling article form and mapping with entities (Article,...)
 */
class ArticleModalDTO extends ArticleAbstractDTO
{
    /** @var \DateTime
    * @Groups("group1")
    */
    public $beginDate;
    /** @var \DateTime 
     * @Groups("group1") */
    public $minBeginDate;
    /** @var \DateTime 
     * @Groups("group1") */
    public $maxBeginDate;
    /** @var boolean
     * @Groups("group1") */
    public $isBeginDateApprox;
    /** @var boolean 
     * @Groups("group1") */
    public $hasNotEndDate;
    /** @var \DateTime 
     * @Groups("group1") */
    public $endDate;
    /** @var \DateTime 
     * @Groups("group1") */
    public $minEndDate;
    /** @var \DateTime 
     * @Groups("group1") */
    public $maxEndDate;
    /** @var boolean 
     * @Groups("group1") */
    public $isEndDateApprox;
    /** @var float 
     * @Groups("group1") */
    public $y;
    /** @var integer */
    public $parentId;
    /** @var Article */
    public $parentArticle;
    /** @var ArticleLink $link */
    public $link;
    
    /**
     * Once the DTO is completed, performs various tasks to make it available for future use
     * Notably updates dates precision and presence */
    static function finalize($dto){
        $dto->isBeginDateApprox = true;
        $dto->beginDate = null;
        if($dto->minBeginDate !== null && $dto->maxBeginDate === null){
            $dto->isBeginDateApprox = false;
            $dto->beginDate = $dto->minBeginDate;
            $dto->minBeginDate = null;
            $dto->maxBeginDate = null;
        }
        $dto->hasNotEndDate = true;
        $dto->isEndDateApprox = false;
        $dto->endDate = null;
        if($dto->minEndDate === null && $dto->maxEndDate !== null){
            $dto->hasNotEndDate = false;
            $dto->endDate = $dto->maxEndDate;
            $dto->minEndDate = null;
            $dto->maxEndDate = null;
        }
        else if($dto->minEndDate !== null && $dto->maxEndDate !== null){
            $dto->hasNotEndDate = false;
            $dto->isEndDateApprox = true;
        }
    }
}