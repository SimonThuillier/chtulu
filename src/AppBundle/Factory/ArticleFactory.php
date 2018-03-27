<?php
namespace AppBundle\Factory;

use AppBundle\Entity\Article;
use AppBundle\Entity\ArticleType;
use Symfony\Bridge\Doctrine\ManagerRegistry;

class ArticleFactory extends EntityFactory
{
    /**
     * ArticleFactory constructor.
     * @param ManagerRegistry $doctrine
     */
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->productClassName = Article::class;
        parent::__construct($doctrine);
    }

    protected function setDefaultData()
    {
        /** @var Article $article */
        $article = $this->product;
        $article->setCreationDate(new \DateTime());
        $article->setCreationUser($this->user);
        $article->setType(
            $this->doctrine->getRepository(ArticleType::class)->find(ArticleType::EVENT)
        );
    }
}