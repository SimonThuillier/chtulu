<?php
namespace App\Factory;

use App\DTO\ArticleLinkDTO;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ArticleLinkDTOFactory extends AbstractDTOFactory
{
    /**
     * @inheritdoc
     */
    public function __construct(ManagerRegistry $doctrine,TokenStorageInterface $tokenStorage)
    {
        $this->productClassName = ArticleLinkDTO::class;
        parent::__construct($doctrine,$tokenStorage);
    }

    /**
     * @inheritdoc
     */
    protected function setDefaultData($product)
    {
        /** @var ArticleLinkDTO $articleLinkDTO */
        $articleLinkDTO = $product;
        $articleLinkDTO->setAbstract("Résumé contextualisé par rapport au présent sur-article");
    }
}