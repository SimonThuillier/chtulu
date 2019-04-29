<?php
namespace AppBundle\Factory;

use AppBundle\DTO\ResourceImageDTO;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ResourceImageDTOFactory extends ResourceVersionDTOFactory
{
    /**
     * @inheritdoc
     */
    public function __construct(ManagerRegistry $doctrine,TokenStorageInterface $tokenStorage)
    {
        parent::__construct($doctrine,$tokenStorage);
        $this->productClassName = ResourceImageDTO::class;
    }

    /**
     * @inheritdoc
     */
    protected function setDefaultData($product)
    {
        parent::setDefaultData($product);
        /** @var ResourceImageDTO $versionDTO */
        $imageDTO = $product;
    }
}