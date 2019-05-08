<?php

namespace App\Factory;

use App\Entity\ResourceVersion;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ResourceVersionFactory extends AbstractEntityFactory
{
    /**
     * ResourceVersionFactory constructor.
     * @inheritdoc
     */
    public function __construct(ManagerRegistry $doctrine,TokenStorageInterface $tokenStorage)
    {
        $this->productClassName = ResourceVersion::class;
        parent::__construct($doctrine,$tokenStorage);
    }

    /**
     * @inheritdoc
     */
    protected function setDefaultData($product)
    {
        /** @var ResourceVersion $version */
        $version = $product;
        $version->setCreationDate(new \DateTime())
        ->setCreationUser($this->getUser())
        ->setActive(true);
    }
}