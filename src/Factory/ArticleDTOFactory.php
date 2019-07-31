<?php
namespace App\Factory;

use App\DTO\ArticleDTO;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ArticleDTOFactory extends AbstractDTOFactory
{
    /**
     * @inheritdoc
     */
    public function __construct(ManagerRegistry $doctrine,TokenStorageInterface $tokenStorage)
    {
        $this->productClassName = ArticleDTO::class;
        parent::__construct($doctrine,$tokenStorage);
    }

    /**
     * @inheritdoc
     */
    protected function setDefaultData($product)
    {
        /** @var ArticleDTO $articleDTO */
        $articleDTO = $product;
        $articleDTO->setHasEndDate(true);
    }
}