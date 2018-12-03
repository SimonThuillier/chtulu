<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:46
 */

namespace AppBundle\Mediator;

use AppBundle\DTO\ResourceGeometryDTO;
use AppBundle\Entity\ResourceFile;
use AppBundle\Entity\ResourceGeometry;
use AppBundle\Factory\DTOFactory;
use AppBundle\Factory\EntityFactory;
use AppBundle\Manager\File\FileRouter;
use AppBundle\Utils\Geometry;
use AppBundle\Utils\UrlBag;
use Psr\Container\ContainerInterface;


class ResourceGeometryDTOMediator extends DTOMediator
{
    public $dtoClassName = ResourceGeometryDTO::class;
    public $entityClassName = ResourceGeometry::class;


    /** @var FileRouter */
    private $fileRouter;
    /**
     * ResourceGeometryDTOMediator constructor.
     * @param ContainerInterface $locator
     */
    public function __construct(ContainerInterface $locator)
    {
        parent::__construct($locator);
        //$this->dtoClassName = self::DTO_CLASS_NAME;
        //$this->entityClassName = self::ENTITY_CLASS_NAME;
        $this->groups = ['minimal','url'];
    }

    /**
     * @return array
     */
    public static function getSubscribedServices()
    {
        return [
            EntityFactory::class,
            DTOFactory::class,
            FileRouter::class
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


    protected function mediateTargetGeometry(){
        /** @var ResourceGeometryDTO $dto */
        $dto = $this->dto;
        /** @var ResourceGeometry $geo*/
        $geo = $this->entity;
        $geo->setTargetGeometry($dto->getTargetGeometry()->getValue());
    }
}