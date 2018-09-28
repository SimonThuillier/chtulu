<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:46
 */

namespace AppBundle\Mediator;

use AppBundle\DTO\ResourceDTO;
use AppBundle\DTO\ResourceImageDTO;
use AppBundle\Entity\HResource;
use AppBundle\Entity\ResourceVersion;
use AppBundle\Factory\DTOFactory;
use AppBundle\Factory\EntityFactory;
use AppBundle\Factory\MediatorFactory;
use AppBundle\Factory\ResourceVersionDTOFactory;
use AppBundle\Utils\ArrayUtil;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\DependencyInjection\ContainerInterface;


class ResourceDTOMediator extends DTOMediator
{
    const DTO_CLASS_NAME = ResourceDTO::class;
    const ENTITY_CLASS_NAME = HResource::class;

    /**
     * ResourceDTOMediator constructor.
     * @param ContainerInterface $locator
     */
    public function __construct(ContainerInterface $locator)
    {
        parent::__construct($locator);
        $this->dtoClassName = self::DTO_CLASS_NAME;
        $this->entityClassName = self::ENTITY_CLASS_NAME;
        $this->groups = ['minimal','activeVersion','activeImage','versions'];
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
            'doctrine' => ManagerRegistry::class
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
     * @param int $mode
     * @param null $subGroups
     * @throws NotAvailableGroupException
     * @throws NullColleagueException
     * @throws \AppBundle\Factory\FactoryException
     */
    protected function mapDTOActiveImageGroup($mode=DTOMediator::NOTHING_IF_NULL,$subGroups=null)
    {
        // TODO : improve and handle nested subgroups
        /** @var HResource $resource */
        $resource = $this->entity;
        /** @var ResourceDTO $dto */
        $dto = $this->dto;

        $version = $this->locator->get('doctrine')->getRepository(ResourceVersion::class)
            ->findOneBy(["resource"=>$resource,"active"=>true]);
        if($version === null && $mode === self::CREATE_IF_NULL){
            $version = $this->locator->get(EntityFactory::class)->create(ResourceVersion::class);
        }

        if($version !== null){
            /** @var ResourceVersionDTOMediator $versionMediator */
            $versionMediator = $this->locator->get(MediatorFactory::class)
                ->create(ResourceVersionDTOMediator::class,$version,
                    $this->locator->get(DTOFactory::class)->create(ResourceImageDTO::class));
            $versionMediator->mapDTOGroups($subGroups);
            $dto->setActiveVersion($versionMediator->getDTO());
        }
        else{
            $dto->setActiveVersion(null);
        }

        $dto->addMappedGroup('activeImage');
        $dto->addMappedGroup('activeVersion');
    }

    /**
     * @param int $mode
     * @param null $subGroups
     * @throws NotAvailableGroupException
     * @throws NullColleagueException
     * @throws \AppBundle\Factory\FactoryException
     */
    protected function mapDTOActiveVersionGroup($mode=DTOMediator::NOTHING_IF_NULL,$subGroups=null)
    {
        // TODO : improve and handle nested subgroups
        /** @var HResource $resource */
        $resource = $this->entity;
        /** @var ResourceDTO $dto */
        $dto = $this->dto;

        $version = $this->locator->get('doctrine')->getRepository(ResourceVersion::class)
            ->findOneBy(["resource"=>$resource,"active"=>true]);
        if($version === null && $mode === self::CREATE_IF_NULL){
            $version = $this->locator->get(EntityFactory::class)->create(ResourceVersion::class);
        }

        if($version !== null){
            /** @var ResourceVersionDTOMediator $versionMediator */
            $versionMediator = $this->locator->get(MediatorFactory::class)
                ->create(ResourceVersionDTOMediator::class,$version);
            $versionMediator->mapDTOGroups($subGroups);
            $dto->setActiveVersion($versionMediator->getDTO());
        }
        else{
            $dto->setActiveVersion(null);
        }

        $dto->addMappedGroup('activeVersion');
    }

    protected function mapDTOVersionsGroup($mode=DTOMediator::NOTHING_IF_NULL,$subGroups=null){
        /** @var ResourceDTO $dto */
        $dto = $this->dto;

        // TODO : to implement

        $dto->addMappedGroup('versions');
    }
}