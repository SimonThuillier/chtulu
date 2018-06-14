<?php

namespace AppBundle\Factory;

use AppBundle\Entity\Resource;
use Symfony\Bridge\Doctrine\ManagerRegistry;

class ResourceFactory extends EntityFactory
{
    /**
     * ResourceFactory constructor.
     * @param $doctrine ManagerRegistry
     */
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->productClassName = Resource::class;
        parent::__construct($doctrine);
    }

    protected function setDefaultData()
    {
        /** @var $resource Resource */
        $resource = $this->product;
        $resource->setCreationDate(new \DateTime());
        $resource->setCreationUser($this->user);
    }
}