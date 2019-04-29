<?php
namespace AppBundle\Factory;

use AppBundle\Entity\Article;
use AppBundle\Entity\ArticleType;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ArticleFactory extends AbstractEntityFactory
{
    /**
     * ArticleFactory constructor.
     * @inheritdoc
     */
    public function __construct(ManagerRegistry $doctrine,TokenStorageInterface $tokenStorage)
    {
        $this->productClassName = Article::class;
        parent::__construct($doctrine,$tokenStorage);
    }

    /**
     * @inheritdoc
     */
    protected function setDefaultData($product)
    {
        /** @var Article $article */
        $article = $product;
        $article->setCreationDate(new \DateTime());
        $article->setCreationUser($this->getUser());
        $article->setType(
            $this->doctrine->getRepository(ArticleType::class)->find(ArticleType::EVENT)
        );
    }
}