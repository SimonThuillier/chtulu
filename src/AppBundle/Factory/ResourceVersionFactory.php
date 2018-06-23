<?php

namespace AppBundle\Factory;

use AppBundle\Entity\ResourceVersion;
use Symfony\Bridge\Doctrine\ManagerRegistry;

class ResourceVersionFactory extends EntityFactory
{
    /**
     * ResourceVersionFactory constructor.
     * @param ManagerRegistry $doctrine
     */
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->productClassName = ResourceVersion::class;
        parent::__construct($doctrine);
    }

    protected function setDefaultData()
    {
        /** @var ResourceVersion $version */
        $version = $this->product;
        $version->setCreationDate(new \DateTime())
        ->setCreationUser($this->user)
        ->setActive(true);
    }
}