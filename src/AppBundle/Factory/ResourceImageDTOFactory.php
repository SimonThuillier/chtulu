<?php
namespace AppBundle\Factory;

use AppBundle\DTO\ResourceImageDTO;
use Symfony\Bridge\Doctrine\ManagerRegistry;

class ResourceImageDTOFactory extends DTOFactory
{
    /**
     * ResourceVersionDTOFactory constructor.
     * @param ManagerRegistry $doctrine
     */
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->productClassName = ResourceImageDTO::class;
        parent::__construct($doctrine);
    }

    protected function setDefaultData()
    {
        /** @var ResourceImageDTO $versionDTO */
        $versionDTO = $this->product;
    }
}