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
    /** @var string
     * @Groups("group1") */
    public $beginLabel;
    /** @var boolean 
     * @Groups("group1") */
    public $hasNotEndDate;
    /** @var string
     * @Groups("group1") */
    public $endLabel;
    /** @var boolean 
     * @Groups("group1") */
    public $isEndDateApprox;
    /** @var string 
     * @Groups("group1") */
    public $subEvents;
}