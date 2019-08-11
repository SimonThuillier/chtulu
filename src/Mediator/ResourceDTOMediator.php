<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:46
 */

namespace App\Mediator;

use App\DTO\ResourceDTO;
use App\DTO\ResourceVersionDTO;
use App\Entity\HResource;
use App\Entity\ResourceVersion;
use App\Factory\DTOFactory;
use App\Factory\EntityFactory;
use App\Factory\MediatorFactory;
use App\Observer\DBActionObserver;
use App\Util\Command\EntityMapperCommand;
use App\Util\Command\LinkCommand;
use Doctrine\Common\Persistence\ManagerRegistry;
use Psr\Container\ContainerInterface;


class ResourceDTOMediator extends DTOMediator
{
    const DTO_CLASS_NAME = ResourceDTO::class;
    const ENTITY_CLASS_NAME = HResource::class;

    /**
     * ResourceDTOMediator constructor.
     * @param ContainerInterface $locator
     * @param DBActionObserver $dbActionObserver
     */
    public function __construct(ContainerInterface $locator, DBActionObserver $dbActionObserver)
    {
        parent::__construct($locator,$dbActionObserver);
        $this->dtoClassName = self::DTO_CLASS_NAME;
        $this->entityClassName = self::ENTITY_CLASS_NAME;
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
            ->setName($resource->getName());
            //->addMappedGroup('minimal');

        // ensure mapped children are loaded
        $resource->getType()->getLabel();
    }

    /**
     * @param int $mode
     * @param null $subGroups
     * @throws NotAvailableGroupException
     * @throws NullColleagueException
     * @throws \App\Factory\FactoryException
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
        if($version !== null){
            /** @var ResourceVersionDTOMediator $versionMediator */
            $versionMediator = $this->locator->get(MediatorFactory::class)
                ->create(ResourceVersionDTO::class,$version->getId(),$version);
            $versionMediator->mapDTOGroups($subGroups);
            $versionMediator->getDTO()->setId($version->getId());
            $dto->setActiveVersion($versionMediator->getDTO());
        }
        else{
            if($mode === self::CREATE_IF_NULL){
                $version = $this->locator->get(EntityFactory::class)->create(ResourceVersion::class);
                /** @var ResourceVersionDTOMediator $versionMediator */
                $versionMediator = $this->locator->get(MediatorFactory::class)
                    ->create(ResourceVersionDTO::class,-1000,$version);
                $versionMediator->mapDTOGroups($subGroups);
                $versionMediator->getDTO()->setId(-1000);
                $dto->setActiveVersion($versionMediator->getDTO());
            }
            else{
                $dto->setActiveVersion(null);
            }
        }
        //$dto->addMappedGroup('activeVersion');
    }

    protected function mapDTOVersionsGroup($mode=DTOMediator::NOTHING_IF_NULL,$subGroups=null){
        /** @var ResourceDTO $dto */
        $dto = $this->dto;

        // TODO : to implement

        //$dto->addMappedGroup('versions');
    }

    protected function mediateActiveVersion()
    {
        /** @var ResourceDTO $dto */
        $dto = $this->dto;
        /** @var HResource $entity */
        $entity = $this->entity;

        $activeVersionDto = $dto->getActiveVersion();
        if($activeVersionDto){
            /** @var ResourceVersion $activeVersion */
            $activeVersion = $activeVersionDto->getMediator()->getEntity();
            $id = $activeVersionDto->getId();

            $command = new LinkCommand(
                EntityMapperCommand::ACTION_LINK,
                ResourceVersion::class,
                $id,
                $activeVersion
            );
            $command->defineLink(
                $this->getEntityClassName(),
                $dto->getId(),
                'setResource',
                false)
                ->setEntityToLink($entity);
            $this->dbActionObserver->registerAction($command);

            $activeVersionDto->getMediator()->returnDataToEntity();
            /*$toDelete = $activeVersionDto->getToDelete();
            $mapperCommands[ResourceVersion::class . ":" . $id] =
                ["action"=>($toDelete?"delete":($id>0?"edit":"add")),"dto"=>$activeVersionDto];*/
            /** @var ResourceVersion $version */
            $truc = $entity->getVersions();
            $number = 1;
            foreach($entity->getVersions() as $version){
                $number++;
                if($version->getId() !== $id && $version->getActive()){
                    $oldVersionMediator = $this->locator->get(MediatorFactory::class)
                        ->create(ResourceVersionDTO::class,$version->getId(),$version);
                    $oldVersionMediator->mapDTOGroups(["minimal"=>true])->resetChangedProperties();
                    $oldVersionMediator->getDTO()->setActive(false);
                    $oldVersionMediator->returnDataToEntity();
                    //$mapperCommands[ResourceVersion::class . ":" . $id] =
                    //    ["action"=>"edit","dto"=>$oldVersionMediator->getDTO()];
                }
            }
            $activeVersion->setNumber($number);
        }
        return true;
    }
}