<?php
namespace AppBundle\Factory;

use AppBundle\DTO\ResourceVersionDTO;
use Symfony\Bridge\Doctrine\ManagerRegistry;

class ResourceVersionDTOFactory extends DTOFactory
{
    /**
     * ResourceVersionDTOFactory constructor.
     * @param ManagerRegistry $doctrine
     */
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->productClassName = ResourceVersionDTO::class;
        parent::__construct($doctrine);
    }

    protected function setDefaultData()
    {
        /** @var ResourceVersionDTO $versionDTO */
        $versionDTO = $this->product;
    }
}