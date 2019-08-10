<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:46
 */

namespace App\Mediator;

use App\DTO\ResourceGeometryDTO;
use App\Entity\ResourceGeometry;
use App\Factory\DTOFactory;
use App\Factory\EntityFactory;
use App\Observer\DBActionObserver;
use App\Util\Geometry;
use Psr\Container\ContainerInterface;


class ResourceGeometryDTOMediator extends DTOMediator
{
    public const DTO_CLASS_NAME = ResourceGeometryDTO::class;
    public const ENTITY_CLASS_NAME = ResourceGeometry::class;

    /**
     * ResourceGeometryDTOMediator constructor.
     * @param ContainerInterface $locator
     * @param DBActionObserver $dbActionObserver
     */
    public function __construct(ContainerInterface $locator, DBActionObserver $dbActionObserver)
    {
        parent::__construct($locator,$dbActionObserver);
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

    protected function mapDTOMinimalGroup()
    {
        /** @var ResourceGeometry $geo */
        $geo = $this->entity;
        /** @var ResourceGeometryDTO $dto */
        $dto = $this->dto;
        $dto
            ->setId($geo->getId())
            ->setTargetGeometry(new Geometry($geo->getTargetGeometry()))
            ->setZoomGeometry($geo->getZoomGeometry())
            ->setComment($geo->getComment());
            //->addMappedGroup('minimal');
    }

    protected function mediateTargetGeometry()
    {
        /** @var ResourceGeometryDTO $dto */
        $dto = $this->dto;
        /** @var ResourceGeometry $geo*/
        $geo = $this->entity;
        $geo->setTargetGeometry($dto->getTargetGeometry()->getValue());
        return true;
    }
}