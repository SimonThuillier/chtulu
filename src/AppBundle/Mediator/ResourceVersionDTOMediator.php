<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:46
 */

namespace AppBundle\Mediator;

use AppBundle\DTO\ResourceVersionDTO;
use AppBundle\Entity\ResourceFile;
use AppBundle\Entity\ResourceVersion;
use AppBundle\Factory\DTOFactory;
use AppBundle\Factory\EntityFactory;
use AppBundle\Manager\File\FileRouter;
use Symfony\Component\DependencyInjection\ContainerInterface;


class ResourceVersionDTOMediator extends DTOMediator
{
    /** @var FileRouter */
    private $fileRouter;
    /**
     * ResourceVersionDTOMediator constructor.
     * @param ContainerInterface $locator
     */
    public function __construct(ContainerInterface $locator)
    {
        parent::__construct($locator);
        $this->entityClassName = ResourceVersion::class;
        $this->dtoClassName = ResourceVersionDTO::class;
        $this->groups = ['minimal','urlDetailThumbnail'];
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
        /** @var ResourceVersion $version */
        $version = $this->entity;
        /** @var ResourceVersionDTO $dto */
        $dto = $this->dto;
        $dto
            ->setId($version->getId())
            ->setNumber($version->getNumber())
            ->setType(($version->getFile())?$version->getFile()->getType():null)
            ->addMappedGroup('minimal');
    }

    protected function mediateFile(){
        /** @var ResourceVersionDTO $dto */
        $dto = $this->dto;
        if($dto->getFile() === null){return;}

        /** @var ResourceVersion $version*/
        $version = $this->entity;

        if($version->getFile() === null){
            $version->setFile($this->locator->get(EntityFactory::class)->create(ResourceFile::class));
        }
        $resourceFile = $version->getFile();

        $resourceFile->setType($dto->getFile()->guessExtension())
            ->setMimeType($dto->getFile()->getMimeType())
            ->setSize($dto->getFile()->getSize());
    }

    protected function mapDTOUrlDetailThumbnailGroup(){
        /** @var ResourceVersionDTO $dto */
        $dto = $this->dto;
        /** @var ResourceVersion $version*/
        $version = $this->entity;

        $fileRouter = $this->locator->get(fileRouter::class);

        $dto->addUrls(
            ["detailThumbnail"=>$fileRouter->getVersionRoute($version,"detail_thumbnail")]);
    }


}