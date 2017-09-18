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
abstract class ArticleAbstractDTO
{
    /** @var string 
     * @Groups("group1")
     */
    public $title;
    /** @var ArticleType 
     * @Groups("group1") 
     */
    public $type;
    /** @var ArticleSubType 
     @Groups("group1") 
     */
    public $subType;
    /** @var string
    * @Groups("group1") 
    */
    public $abstract;
}