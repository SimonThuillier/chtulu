<?php
namespace AppBundle\Factory;

use AppBundle\Entity\Article;
use AppBundle\DTO\ArticleModalDTO;
use AppBundle\Entity\ArticleLink;

class ArticleLinkFactory  extends AbstractEntityFactory
{
    /**
     * Help to set data in the method newInstance in AbstractEntityFactory
     * @param $dto
     * @return ArticleLink
     */
    public function newInstance($dto)
    {
        $link = parent::newInstance($dto);
        return $link;
    }
    
    public function setData($dto,$entity)
    {
        /** @var ArticleLink $link  */
        $link = $entity;
        /** @var ArticleModalDTO $dto */
        $link->setY($dto->y);
        $link->setParentArticle($dto->parentArticle);
        $link->setChildArticle($dto->childArticle);
    }
}