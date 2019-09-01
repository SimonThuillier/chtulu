<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:46
 */

namespace App\Mediator;

use App\DTO\UserDTO;
use App\Entity\User;
use App\Factory\MediatorFactory;
use App\Helper\AssetHelper;
use App\Observer\DBActionObserver;
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
        $this->groups = ['minimal','email','description'];
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

}