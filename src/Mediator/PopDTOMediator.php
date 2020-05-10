<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:46
 */

namespace App\Mediator;


use App\DTO\PopDTO;
use App\Entity\Pop;
use App\Entity\PopType;
use App\Factory\DTOFactory;
use App\Factory\EntityFactory;
use App\Observer\DBActionObserver;
use App\Util\AuthorizationBag;
use App\Util\Geometry;
use Psr\Container\ContainerInterface;


class PopDTOMediator extends DTOMediator
{
    public const DTO_CLASS_NAME = PopDTO::class;
    public const ENTITY_CLASS_NAME = Pop::class;

    /**
     * PopDTOMediator constructor.
     * @param ContainerInterface $locator
     * @param DBActionObserver $dbActionObserver
     */
    public function __construct(ContainerInterface $locator, DBActionObserver $dbActionObserver,$user)
    {
        parent::__construct($locator,$dbActionObserver,$user);
        $this->dtoClassName = self::DTO_CLASS_NAME;
        $this->entityClassName = self::ENTITY_CLASS_NAME;
        $this->groups = ['minimal'];
    }

    /**
     * @return array
     */
    public static function getSubscribedServices()
    {
        return [
            EntityFactory::class,
            DTOFactory::class
        ];
    }

    protected function setAuthorizationBag(){
        $this->authorizationBag = new AuthorizationBag();
        $this->authorizationBag
            ->setRight(AuthorizationBag::READ,true,'a definir ...')
            ->setRight(AuthorizationBag::EDIT,true,'a definir ...')
            ->setRight(AuthorizationBag::ADMIN,true,'a definir ...');
    }

    protected function mapDTOMinimalGroup()
    {
        /** @var Pop $pop */
        $pop = $this->entity;
        /** @var PopDTO $dto */
        $dto = $this->dto;
        $dto
            ->setType($pop->getType())
            ->setComment($pop->getComment())
            ->setNumber($pop->getNumber())
            ->setTargetGeometry(new Geometry($pop->getTargetGeometry()))
            ->setId($pop->getId())
        ;
            //->addMappedGroup('minimal');
    }

    protected function mediateTargetGeometry()
    {
        /** @var PopDTO $dto */
        $dto = $this->dto;
        /** @var Pop $pop*/
        $pop = $this->entity;
        $pop->setTargetGeometry($dto->getTargetGeometry()->getValue());
        return true;
    }
}