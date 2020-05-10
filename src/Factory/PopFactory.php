<?php
namespace App\Factory;

use App\Entity\PopType;
use App\Entity\Pop;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class PopFactory extends AbstractEntityFactory
{
    /**
     * ArticleFactory constructor.
     * @inheritdoc
     */
    public function __construct(ManagerRegistry $doctrine,TokenStorageInterface $tokenStorage)
    {
        $this->productClassName = Pop::class;
        parent::__construct($doctrine,$tokenStorage);
    }

    /**
     * @inheritdoc
     */
    protected function setDefaultData($product)
    {
        /** @var Pop $pop */
        $pop = $product;
        $pop
            ->setType(
            $this->doctrine->getRepository(PopType::class)->find(PopType::DEFAULT))
            ->setNumber(50);
    }
}