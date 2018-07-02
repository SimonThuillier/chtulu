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
use AppBundle\Factory\DTOFactory;
use AppBundle\Factory\EntityFactory;
use AppBundle\Factory\MediatorFactory;
use AppBundle\Factory\ResourceVersionDTOFactory;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\DependencyInjection\ContainerInterface;


class ResourceDTOMediator extends DTOMediator
{

    /**
     * ResourceDTOMediator constructor.
     * @param ContainerInterface $locator
     */
    public function __construct(ContainerInterface $locator)
    {
        parent::__construct($locator);
        $this->entityClassName = HResource::class;
        $this->dtoClassName = ResourceDTO::class;
        $this->groups = ['minimal','activeVersion','versions'];
    }

    /**
     * @return array
     */
    public static function getSubscribedServices()
    {
        return [
            EntityFactory::class,
            DTOFactory::class,
            MediatorFactory::class,
            ManagerRegistry::class
        ];
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

        $version = $this->locator->get(ManagerRegistry::class)->getRepository(ResourceVersion::class)
            ->findOneBy(["resource"=>$resource,"active"=>true]);

        if($version !== null){
            /** @var ResourceVersionDTOMediator $versionMediator */
            $versionMediator = $this->locator->get(MediatorFactory::class)
                ->create(ResourceVersionDTOMediator::class,$version);
            $versionMediator->mapDTOGroup("minimal");
            $dto->setActiveVersion($versionMediator->getDTO());
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