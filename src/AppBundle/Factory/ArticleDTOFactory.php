<?php
namespace AppBundle\Factory;

use AppBundle\DTO\ArticleDTO;
use Symfony\Bridge\Doctrine\ManagerRegistry;

class ArticleDTOFactory extends DTOFactory
{
    /**
     * ArticleDTOFactory constructor.
     * @param ManagerRegistry $doctrine
     */
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->productClassName = ArticleDTO::class;
        parent::__construct($doctrine);
    }

    protected function setDefaultData()
    {
        /** @var ArticleDTO $articleDTO */
        $articleDTO = $this->product;
    }
}