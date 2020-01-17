<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:46
 */

namespace App\Mediator;

use App\DTO\ResourceVersionDTO;
use App\Entity\ResourceFile;
use App\Entity\ResourceVersion;
use App\Factory\DTOFactory;
use App\Factory\EntityFactory;
use App\Manager\File\FileLocalUploader;
use App\Manager\File\FileRouter;
use App\Observer\DBActionObserver;
use App\Util\Command\EntityMapperCommand;
use App\Util\Command\LinkCommand;
use Psr\Container\ContainerInterface;


class ResourceVersionDTOMediator extends DTOMediator
{
    const DTO_CLASS_NAME = ResourceVersionDTO::class;
    const ENTITY_CLASS_NAME = ResourceVersion::class;

    /**
     * ResourceVersionDTOMediator constructor.
     * @param ContainerInterface $locator
     * @param DBActionObserver $dbActionObserver
     * @param FileLocalUploader $fileLocalUploader
     */
    public function __construct(
        ContainerInterface $locator,
        DBActionObserver $dbActionObserver
    )
    {
        parent::__construct($locator,$dbActionObserver);
        $this->dtoClassName = ResourceVersionDTO::class;
        $this->entityClassName = ResourceVersion::class;
        $this->groups = ['minimal','file','urlDetailThumbnail','urlMini','urlW160','urlW500','urlW800','urlW1500'];
    }

    /**
     * @return array
     */
    public static function getSubscribedServices()
    {
        return [
            EntityFactory::class,
            DTOFactory::class,
            FileRouter::class,
            FileLocalUploader::class
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
            ->setType(($version->getFile())?$version->getFile()->getType():null);
            //->addMappedGroup('minimal');
    }

    protected function mapDTOFileGroup(){}

    /**
     * factorize the logic to map a wanted urlGroup
     * @param $urlGroupName
     */
    private function mapUrl($urlGroupName)
    {
        /** @var ResourceVersionDTO $dto */
        $dto = $this->dto;
        /** @var ResourceVersion $version*/
        $version = $this->entity;
        if($version->getId() !== null && $version->getId()>0){
            $fileRouter = $this->locator->get(fileRouter::class);
            $dto->addUrls(
                [$urlGroupName=>$fileRouter->getVersionRoute($version,
                    strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $urlGroupName)))]);
        }
    }



    protected function mapDTOUrlDetailThumbnailGroup()
    {
        $this->mapUrl('detailThumbnail');
    }

    protected function mapDTOUrlMiniGroup()
    {
        $this->mapUrl('mini');
    }

    protected function mapDTOUrlW160Group()
    {
        $this->mapUrl('w160');
    }

    protected function mapDTOUrlW500Group()
    {
        $this->mapUrl('w500');
    }

    protected function mapDTOUrlW800Group()
    {
        $this->mapUrl('w800');
    }

    protected function mapDTOUrlW1500Group()
    {
        $this->mapUrl('w1500');
    }

    protected function mediateFile()
    {
        /** @var ResourceVersionDTO $dto */
        $dto = $this->dto;
        if($dto->getFile() === null){return true;}

        /** @var ResourceVersion $version*/
        $version = $this->entity;

        if($version->getFile() === null){
            $resourceFile = $this->locator->get(EntityFactory::class)->create(ResourceFile::class);
            $command = new EntityMapperCommand(
                EntityMapperCommand::ACTION_ADD,
                ResourceFile::class,
                $dto->getId(),
                $resourceFile
            );

            $this->dbActionObserver->registerAction($command);

            $command = new LinkCommand(
                EntityMapperCommand::ACTION_LINK,
                $this->getEntityClassName(),
                $dto->getId(),
                $version
            );
            $command->defineLink(
                ResourceFile::class,
                $dto->getId(),
                'setFile',
                true)
            ->setEntityToLink($resourceFile);
            $this->dbActionObserver->registerAction($command);
        }
        else{
            $resourceFile = $version->getFile();
        }

        try{
            $resourceFile
                ->setType($dto->getFile()->guessExtension())
                ->setMimeType($dto->getFile()->getMimeType())
                ->setSize($dto->getFile()->getSize());

            $fileUploader = $this->locator->get(FileLocalUploader::class);
            $uri = $fileUploader->upload($dto->getFile());

            $resourceFile->setUri($uri);
        }
        catch(\Exception $e){
            throw new \Exception("Impossible to store the uploaded file : " . $e->getMessage());
        }

        return true;
    }
}