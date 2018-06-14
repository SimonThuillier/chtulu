<?php

namespace AppBundle\Factory;

use AppBundle\Entity\ResourceFile;
use Symfony\Bridge\Doctrine\ManagerRegistry;

class ResourceFileFactory extends EntityFactory
{
    /**
     * ResourceFileFactory constructor.
     * @param ManagerRegistry $doctrine
     */
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->productClassName = ResourceFile::class;
        parent::__construct($doctrine);
    }

    protected function setDefaultData()
    {
        /** @var ResourceFile $file */
        $file = $this->product;
        $file->setSize(0);
    }
}