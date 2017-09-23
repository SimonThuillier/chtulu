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
        parent::newInstance($dto);
        /** @var ArticleLink $link  */
        $link = $this->entity;
        /** @var ArticleModalDTO $dto */
        $dto = $this->dto;
        $link->setParentArticle($dto->parentArticle);
        $link->setChildArticle($dto->childArticle);
        $this->setData();
        return $this->entity;
    }
    
    public function setData()
    {
        /** @var ArticleLink $link  */
        $link = $this->entity;
        /** @var ArticleModalDTO $dto */
        $dto = $this->dto;
        $link->setY($dto->y);
    }
}