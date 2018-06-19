<?php

namespace AppBundle\Factory;

use AppBundle\Entity\HResource;
use AppBundle\Entity\ResourceType;
use Symfony\Bridge\Doctrine\ManagerRegistry;

class ResourceFactory extends EntityFactory
{
    /**
     * ResourceFactory constructor.
     * @param $doctrine ManagerRegistry
     */
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->productClassName = HResource::class;
        parent::__construct($doctrine);
    }

    protected function setDefaultData()
    {
        /** @var $resource HResource */
        $resource = $this->product;
        $resource->setCreationDate(new \DateTime())
            ->setCreationUser($this->user)
            ->setName("Nouvelle ressource")
            ->setType(
            $this->doctrine->getRepository(ResourceType::class)->find(ResourceType::IMAGE)
        );
    }
}