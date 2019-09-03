<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:46
 */

namespace App\Mediator;

use App\DTO\ResourceDTO;
use App\DTO\UserDTO;
use App\Entity\HResource;
use App\Entity\User;
use App\Factory\MediatorFactory;
use App\Helper\AssetHelper;
use App\Observer\DBActionObserver;
use App\Util\Command\EntityMapperCommand;
use App\Util\Command\LinkCommand;
use Doctrine\Common\Persistence\ManagerRegistry;
use Psr\Container\ContainerInterface;
use Symfony\Component\Routing\RouterInterface;

class UserDTOMediator extends DTOMediator
{
    const DTO_CLASS_NAME = UserDTO::class;
    const ENTITY_CLASS_NAME = User::class;

    /**
     * UserDTOMediator constructor.
     * @param ContainerInterface $locator
     * @param DBActionObserver $dbActionObserver
     */
    public function __construct(ContainerInterface $locator, DBActionObserver $dbActionObserver)
    {
        parent::__construct($locator,$dbActionObserver);
        $this->dtoClassName = self::DTO_CLASS_NAME;
        $this->entityClassName = self::ENTITY_CLASS_NAME;
        $this->groups = ['minimal','email','description','detailImage'];
    }

    /**
     * @return array
     */
    public static function getSubscribedServices()
    {
        return [
            AssetHelper::class,
            MediatorFactory::class,
            'router' => RouterInterface::class,
            'doctrine' => ManagerRegistry::class
        ];
    }

    protected function mapDTOMinimalGroup()
    {
        /** @var User $user */
        $user = $this->entity;
        /** @var UserDTO $dto */
        $dto = $this->dto;
        $dto
            ->setUsername($user->getUsername())
            ->setSignature($user->getSignature())
            ->setCreation($user->getCreation())
            ->setId($user->getId());
    }

    protected function mapDTOEmailGroup()
    {
        /** @var User $user */
        $user = $this->entity;
        /** @var UserDTO $dto */
        $dto = $this->dto;
        $dto
            ->setEmail($user->getEmail());
    }

    protected function mapDTODescriptionGroup()
    {
        /** @var User $user */
        $user = $this->entity;
        /** @var UserDTO $dto */
        $dto = $this->dto;
        $dto
            ->setDescription($user->getDescription());
    }

    protected function mapDTODetailImageGroup($mode=DTOMediator::NOTHING_IF_NULL,$subGroups=null)
    {
        $assetHelper = $this->locator->get(AssetHelper::class);
        /** @var UserDTO $dto */
        $dto = $this->dto;
        /** @var User $user */
        $user = $this->entity;

        $detailImage = $user->getDetailImage();
        $detailUrl = null;

        if($detailImage !== null){
            if($dto->getDetailImageResource() === null){
                $resourceMediator = $this->locator->get(MediatorFactory::class)
                    ->create(ResourceDTO::class,$detailImage->getId(),$detailImage,null,$mode);
            }
            else{
                $resourceMediator = $dto->getDetailImageResource()->getMediator();
            }
            $resourceMediator->mapDTOGroups($subGroups,$mode);
            $dto->setDetailImageResource($resourceMediator->getDTO());
        }
        else{
            $dto->setDetailImageResource(null);
        }
    }

    /** creation is a read only data that must obviously remain unchanged */
    protected function mediateCreation(){}

    protected function mediateDetailImageResource()
    {
        /** @var UserDTO $dto */
        $dto = $this->dto;
        /** @var User $user */
        $user = $this->entity;

        if($dto->getDetailImageResource() !== null){
            $command = new LinkCommand(
                EntityMapperCommand::ACTION_LINK,
                $this->getEntityClassName(),
                $dto->getId(),
                $user
            );
            $command->defineLink(
                HResource::class,
                $dto->getDetailImageResource()->getId(),
                'setDetailImage',
                false)
                ->setEntityToLink($dto->getDetailImageResource()->getMediator()->getEntity());
            ;
            $this->dbActionObserver->registerAction($command);
        }
        else{
            $user->setDetailImage(null);
        }
        return true;
    }

}