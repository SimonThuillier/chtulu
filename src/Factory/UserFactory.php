<?php
namespace App\Factory;

use App\Entity\User;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class UserFactory extends AbstractEntityFactory
{
    /**
     * PendingActionFactory constructor.
     * @inheritdoc
     */
    public function __construct(ManagerRegistry $doctrine,TokenStorageInterface $tokenStorage)
    {
        $this->productClassName = User::class;
        parent::__construct($doctrine,$tokenStorage);
    }

    /**
     * @inheritdoc
     */
    protected function setDefaultData($product)
    {
        /** @var User $user */
        $user = $product;
        $user
            ->setCreation(new \DateTime())
            ->setLastUpdate(new \DateTime());
    }
}