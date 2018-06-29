<?php
namespace AppBundle\Factory;

use AppBundle\Entity\ArticleLink;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ArticleLinkFactory extends AbstractEntityFactory
{
    /**
     * ArticleLinkFactory constructor.
     * @inheritdoc
     */
    public function __construct(ManagerRegistry $doctrine,TokenStorageInterface $tokenStorage)
    {
        $this->productClassName = ArticleLink::class;
        parent::__construct($doctrine,$tokenStorage);
    }

    /**
     * @inheritdoc
     */
    protected function setDefaultData($product)
    {
        /** @var ArticleLink $articleLink */
        $articleLink = $product;
        // TODO : implements some actions if needed
    }
}