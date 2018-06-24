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
use AppBundle\Manager\File\FileRouter;


class ResourceVersionDTOMediator extends DTOMediator
{
    /** @var FileRouter */
    private $fileRouter;
    /**
     * ResourceVersionDTOMediator constructor.
     * @param FileRouter $fileRouter
     */
    public function __construct(FileRouter $fileRouter)
    {
        parent::__construct();
        $this->fileRouter = $fileRouter;
        $this->groups = ['minimal','urlDetailThumbnail'];
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
            $version->setFile(new ResourceFile());
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

        $dto->addUrls(["detail_thumbnail"=>$this->fileRouter->getVersionRoute($version,"detail_thumbnail")]);
    }


}