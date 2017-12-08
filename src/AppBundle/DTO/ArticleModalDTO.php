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
    /** @var float 
     * @Groups("group1") */
    public $y;
    /** @var integer
     @Groups("group1") */
    public $id;
    /** @var Article */
    public $article;
    /** @var integer
     @Groups("group1") */
    public $parentId;
    /** @var Article */
    public $parentArticle;
    /** @var integer
     @Groups("group1") */
    public $linkId;
    /** @var ArticleLink $link */
    public $link;
    /** @var string
     @Groups("group1") */
    public $url;
}