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
class ArticleLinkDTO
{
    /** @var float 
     * @Groups("group1") */
    public $y;
    /** @var Article */
    public $parentArticle;
    /** @var Article */
    public $childArticle;
    
    public function __construct($parentArticle,$childArticle,$y){
        $this->parentArticle=$parentArticle;
        $this->childArticle=$childArticle;
        $this->y=$y;
        
        return $this;
    }
}