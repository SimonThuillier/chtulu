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
use Symfony\Component\DependencyInjection\ContainerInterface;


class ResourceGeometryDTOMediator extends DTOMediator
{
    /** @var FileRouter */
    private $fileRouter;
    /**
     * ResourceGeometryDTOMediator constructor.
     * @param ContainerInterface $locator
     */
    public function __construct(ContainerInterface $locator)
    {
        parent::__construct($locator);
        $this->entityClassName = ResourceGeometry::class;
        $this->dtoClassName = ResourceGeometryDTO::class;
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
            ->setComment($geo->getComment())
            ->addMappedGroup('minimal');
    }

    protected function mapDTOUrlGroup()
    {
        if ($this->dto->getId() <1) return $this->mapDTOUrlGroupForNewEntity();

        /** @var ResourceGeometry $resource */
        $resource = $this->entity;
        /** @var ResourceGeometryDTO $dto */
        $dto = $this->dto;

        $router = $this->locator->get('router');

        $postUrl = $dto->getId()>0?$router->generate("article_post_edit",["article"=>$resource])
            :$router->generate("article_post_create");

        if ($dto->getUrlBag() === null){$dto->setUrlBag(new UrlBag());}
        $dto->getUrlBag()
            ->setPost($postUrl);

        $dto->addMappedGroup('url');
    }

    protected function mapDTOUrlGroupForNewEntity()
    {
        $router = $this->locator->get('router');
        /** @var ResourceGeometryDTO $dto */
        $dto = $this->dto;

        if ($dto->getUrlBag() === null){$dto->setUrlBag(new UrlBag());}
        $dto->getUrlBag()
            ->setPost($router->generate("article_post_create"));

        $dto->addMappedGroup('url');
    }
    
    
    
    
//
//    protected function mediateFile(){
//        /** @var ResourceGeometryDTO $dto */
//        $dto = $this->dto;
//        if($dto->getFile() === null){return;}
//
//        /** @var ResourceGeometry $geo*/
//        $geo = $this->entity;
//
//        if($geo->getFile() === null){
//            $geo->setFile($this->locator->get(EntityFactory::class)->create(ResourceFile::class));
//        }
//        $resourceFile = $geo->getFile();
//
//        $resourceFile->setType($dto->getFile()->guessExtension())
//            ->setMimeType($dto->getFile()->getMimeType())
//            ->setSize($dto->getFile()->getSize());
//    }
}