<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:46
 */

namespace AppBundle\Mediator;

use AppBundle\DTO\ResourceDTO;
use AppBundle\Entity\HResource;
use AppBundle\Entity\ResourceVersion;
use AppBundle\Factory\ResourceVersionDTOFactory;
use Symfony\Bridge\Doctrine\ManagerRegistry;


class ResourceDTOMediator extends DTOMediator
{
    /** @var ResourceVersionDTOMediator */
    private $versionDtoMediator;
    /** @var ResourceVersionDTOFactory */
    private $versionDtoFactory;
    /** @var ManagerRegistry */
    private $doctrine;

    /**
     * ResourceDTOMediator constructor.
     */
    public function __construct(ResourceVersionDTOMediator $versionDtoMediator,
                                ResourceVersionDTOFactory $versionDtoFactory,
                                ManagerRegistry $doctrine)
    {
        parent::__construct();
        $this->versionDtoFactory = $versionDtoFactory;
        $this->versionDtoMediator = $versionDtoMediator;
        $this->doctrine = $doctrine;
        $this->groups = ['minimal','activeVersion','versions'];
    }

    protected function mapDTOMinimalGroup()
    {
        /** @var HResource $resource */
        $resource = $this->entity;
        /** @var ResourceDTO $dto */
        $dto = $this->dto;
        $dto
            ->setId($resource->getId())
            ->setType($resource->getType())
            ->setName($resource->getName())
            ->addMappedGroup('minimal');

        // ensure mapped children are loaded
        $resource->getType()->getLabel();
    }

    /**
     * @param null $subGroups
     * @throws NotAvailableGroupException
     * @throws NullColleagueException
     * @throws \AppBundle\Factory\FactoryException
     */
    protected function mapDTOActiveVersionGroup($subGroups=null)
    {
        // TODO : improve and handle nested subgroups
        /** @var HResource $resource */
        $resource = $this->entity;
        /** @var ResourceDTO $dto */
        $dto = $this->dto;

        $version = $this->doctrine->getRepository(ResourceVersion::class)
            ->findOneBy(["resource"=>$resource,"active"=>true]);

        if($version !== null){
            $versionDto = $this->versionDtoFactory->create($resource->getEditionUser());
            $this->versionDtoMediator->setEntity($version)->setDTO($versionDto)
                ->mapDTOGroup("minimal");
            $dto->setActiveVersion($versionDto);
            $this->versionDtoMediator->setEntity(null)->setDTO(null);
        }
        else{
            $dto->setActiveVersion(null);
        }

        $dto->addMappedGroup('activeVersion');
    }

    protected function mapDTOVersionsGroup($subGroups=null){
        /** @var ResourceDTO $dto */
        $dto = $this->dto;

        // TODO : to implement

        $dto->addMappedGroup('versions');
    }
}