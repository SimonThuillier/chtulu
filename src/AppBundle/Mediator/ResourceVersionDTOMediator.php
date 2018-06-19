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


class ResourceVersionDTOMediator extends DTOMediator
{

    /**
     * ResourceVersionDTOMediator constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->groups = ['minimal'];
    }

    /**
     * @param string $group
     * @throws NotAvailableGroupException
     * @throws NullColleagueException
     * @return self
     */
    public function mapDTOGroup(String $group)
    {
        parent::mapDTOGroup($group);
        $function = 'mapDTO' . ucfirst($group) . 'Group';
        $this->$function();

        return $this;
    }

    private function mapDTOMinimalGroup()
    {
        /** @var ResourceVersion $version */
        $version = $this->entity;
        /** @var ResourceVersionDTO $dto */
        $dto = $this->dto;
        $dto
            ->setId($version->getId())
            ->addMappedGroup('minimal');
    }

    protected function mediateFile(){
        /** @var ResourceVersionDTO $dto */
        $dto = $this->dto;
        /** @var ResourceVersion $version*/
        $version = $this->entity;

        if($version->getFile() === null){
            $version->setFile(new ResourceFile());
        }
        $resourceFile = $version->getFile();

        $resourceFile->setUri($dto->getFile()->getFilename())->setType('lol')->setMimeType('lol')
            ->setSize($dto->getFile()->getSize());
    }


}