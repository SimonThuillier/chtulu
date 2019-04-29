<?php
namespace AppBundle\Factory;

use AppBundle\Entity\ResourceGeometry;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ResourceGeometryFactory extends AbstractEntityFactory
{
    /**
     * ArticleLinkFactory constructor.
     * @inheritdoc
     */
    public function __construct(ManagerRegistry $doctrine,TokenStorageInterface $tokenStorage)
    {
        $this->productClassName = ResourceGeometry::class;
        parent::__construct($doctrine,$tokenStorage);
    }

    /**
     * @inheritdoc
     */
    protected function setDefaultData($product)
    {
        /** @var ResourceGeometry $resourceGeometry */
        $resourceGeometry = $product;
        // TODO : implements some actions if needed
    }
}