<?php

namespace AppBundle\DTO;

use AppBundle\Entity\ArticleType;
use AppBundle\Entity\ArticleSubType;
use Symfony\Component\Serializer\Annotation\Groups;


/**
 * 
 * @author belze
 * DTO for handling article form and mapping with entities (Article,...)
 */
class ArticleMainDTO extends ArticleAbstractDTO
{
    /** @var \DateTime 
     * @Groups("group1") */
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
    /** @var string 
     * @Groups("group1") */
    public $subEvents;
}