<?php
namespace AppBundle\Factory;

use AppBundle\DTO\ResourceDTO;
use Symfony\Bridge\Doctrine\ManagerRegistry;

class ResourceDTOFactory extends DTOFactory
{
    /**
     * ResourceDTOFactory constructor.
     * @param ManagerRegistry $doctrine
     */
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->productClassName = ResourceDTO::class;
        parent::__construct($doctrine);
    }

    protected function setDefaultData()
    {
        /** @var ResourceDTO $resourceDTO */
        $resourceDTO = $this->product;
    }
}