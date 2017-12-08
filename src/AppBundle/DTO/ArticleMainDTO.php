<?php

namespace AppBundle\DTO;

use AppBundle\Entity\ArticleType;
use AppBundle\Entity\ArticleSubType;
use Symfony\Component\Serializer\Annotation\Groups;
use AppBundle\Utils\HDate;
use AppBundle\Entity\DateType;


/**
 * 
 * @author belze
 * DTO for handling article form and mapping with entities (Article,...)
 */
class ArticleMainDTO extends ArticleAbstractDTO
{
    /** @var string 
     * @Groups("group1") */
    public $subEvents;
}