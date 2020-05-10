<?php
namespace App\Factory;

use App\DTO\PopDTO;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class PopDTOFactory extends AbstractDTOFactory
{
    /**
     * @inheritdoc
     */
    public function __construct(ManagerRegistry $doctrine,TokenStorageInterface $tokenStorage)
    {
        $this->productClassName = PopDTO::class;
        parent::__construct($doctrine,$tokenStorage);
    }

    /**
     * @inheritdoc
     */
    protected function setDefaultData($product)
    {
        /** @var PopDTO $resourceDTO */
        $popDTO = $product;
    }
}