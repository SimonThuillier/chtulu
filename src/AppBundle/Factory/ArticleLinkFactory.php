<?php
namespace AppBundle\Factory;

use AppBundle\Entity\ArticleLink;
use Symfony\Bridge\Doctrine\ManagerRegistry;

class ArticleLinkFactory extends EntityFactory
{
    /**
     * ArticleLinkFactory constructor.
     * @param ManagerRegistry $doctrine
     */
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->productClassName = ArticleLink::class;
        parent::__construct($doctrine);
    }

    protected function setDefaultData()
    {
        /** @var ArticleLink $articleLink */
        $articleLink = $this->product;
        // TODO : implements some actions if needed
    }
}