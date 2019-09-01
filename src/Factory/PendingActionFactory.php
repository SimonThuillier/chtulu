<?php
namespace App\Factory;

use App\Entity\PendingAction;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class PendingActionFactory extends AbstractEntityFactory
{
    /**
     * PendingActionFactory constructor.
     * @inheritdoc
     */
    public function __construct(ManagerRegistry $doctrine,TokenStorageInterface $tokenStorage)
    {
        $this->productClassName = PendingAction::class;
        parent::__construct($doctrine,$tokenStorage);
    }

    /**
     * @inheritdoc
     */
    protected function setDefaultData($product)
    {
        /** @var PendingAction $action */
        $action = $product;
        $action
            ->setUser($this->getUser())
            ->setCreatedAt(new \DateTime())
            ->setUpdatedAt(new \DateTime());
    }
}