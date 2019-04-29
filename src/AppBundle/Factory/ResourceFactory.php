<?php

namespace AppBundle\Factory;

use AppBundle\Entity\HResource;
use AppBundle\Entity\ResourceType;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ResourceFactory extends AbstractEntityFactory
{
    /**
     * ResourceFactory constructor.
     * @inheritdoc
     */
    public function __construct(ManagerRegistry $doctrine,TokenStorageInterface $tokenStorage)
    {
        $this->productClassName = HResource::class;
        parent::__construct($doctrine,$tokenStorage);
    }

    /**
     * @inheritdoc
     */
    protected function setDefaultData($product)
    {
        /** @var $resource HResource */
        $resource = $product;
        $resource->setCreationDate(new \DateTime())
            ->setCreationUser($this->getUser())
            ->setName("Nouvelle ressource")
            ->setType(
            $this->doctrine->getRepository(ResourceType::class)->find(ResourceType::IMAGE)
        );
    }
}