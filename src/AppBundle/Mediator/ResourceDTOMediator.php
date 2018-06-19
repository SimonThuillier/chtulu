<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:46
 */

namespace AppBundle\Mediator;

use AppBundle\DTO\ResourceDTO;
use AppBundle\Entity\HResource;


class ResourceDTOMediator extends DTOMediator
{

    /**
     * ResourceDTOMediator constructor.
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
        /** @var HResource $resource */
        $resource = $this->entity;
        /** @var ResourceDTO $dto */
        $dto = $this->dto;
        $dto
            ->setId($resource->getId())
            ->setType($resource->getType())
            ->setName($resource->getName())
            ->addMappedGroup('minimal');

        // ensure mapped children are loaded
        $resource->getType()->getLabel();
    }
}