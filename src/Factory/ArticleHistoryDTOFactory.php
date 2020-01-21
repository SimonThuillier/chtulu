<?php
namespace App\Factory;

use App\DTO\ArticleHistoryDTO;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ArticleHistoryDTOFactory extends AbstractDTOFactory
{
    /**
     * @inheritdoc
     */
    public function __construct(ManagerRegistry $doctrine,TokenStorageInterface $tokenStorage)
    {
        $this->productClassName = ArticleHistoryDTO::class;
        parent::__construct($doctrine,$tokenStorage);
    }

    /**
     * @inheritdoc
     */
    protected function setDefaultData($product)
    {
        /** @var ArticleHistoryDTO $articleHistoryDTO */
        $articleHistoryDTO = $product;
    }
}