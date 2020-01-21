<?php
namespace App\Factory;

use App\Entity\ArticleHistory;
use App\Entity\ArticleStatus;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ArticleHistoryFactory extends AbstractEntityFactory
{
    /**
     * ArticleLinkFactory constructor.
     * @inheritdoc
     */
    public function __construct(ManagerRegistry $doctrine,TokenStorageInterface $tokenStorage)
    {
        $this->productClassName = ArticleHistory::class;
        parent::__construct($doctrine,$tokenStorage);
    }

    /**
     * @inheritdoc
     */
    protected function setDefaultData($product)
    {
        /** @var ArticleHistory $articleHistory */
        $articleHistory = $product;

        $articleHistory
            ->setActive(true)
            ->setCreationDate(new \DateTime())
            ->setCreationUser($this->getUser())
            ->setEditionDate(new \DateTime())
            ->setStatus(
                $this->doctrine->getRepository(ArticleStatus::class)->find(ArticleStatus::DRAFT)
            )
            ;
    }
}