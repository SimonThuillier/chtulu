<?php

namespace AppBundle\Factory;

use AppBundle\Entity\ResourceFile;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ResourceFileFactory extends AbstractEntityFactory
{
    /**
     * ResourceFileFactory constructor.
     * @inheritdoc
     */
    public function __construct(ManagerRegistry $doctrine,TokenStorageInterface $tokenStorage)
    {
        $this->productClassName = ResourceFile::class;
        parent::__construct($doctrine,$tokenStorage);
    }

    /**
     * @inheritdoc
     */
    protected function setDefaultData($product)
    {
        /** @var ResourceFile $file */
        $file = $product;
        $file->setSize(0);
    }
}