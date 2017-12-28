<?php
namespace AppBundle\Factory;

use AppBundle\DTO\ArticleModalDTO;
use AppBundle\Entity\Article;
use AppBundle\DTO\ArticleMainDTO;
use AppBundle\Mapper\AutoMapper;

class ArticleFactory  extends AbstractEntityFactory
{
    /**
     * Help to set data in the method newInstance in AbstractEntityFactory
     * @param $dto
     * @return Article
     */
    public function newInstance($dto)
    {
        $article = parent::newInstance($dto);
        $article->setCreationDate(new \DateTime());
        return $article;
    }

    public function setData($dto,$entity)
    {
        AutoMapper::autoMap($dto, $entity);

        $article = $entity;
        /** @var Article $article  */
        /** @var ArticleModalDTO $dto */
        $article->setEditionDate(new \DateTime());
    }
}