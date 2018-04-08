<?php

namespace AppBundle\DTO;

use Symfony\Component\Serializer\Annotation\Groups;
use AppBundle\Mediator\DTOMediator;

abstract class EntityMutableDTO {

    /** @var DTOMediator */
    protected $mediator;
    /** @var array */
    protected $groups;


    public function __construct()
    {
        $this->groups = [];
    }

    /**
     * @return DTOMediator||null
     */
    public function getMediator(){
        return $this->mediator;
    }

    /**
     * @param DTOMediator|null $mediator
     */
    public function setMediator($mediator){
        if($mediator === $this->mediator) return;
        if($this->mediator !== null) $this->mediator->setDTO(null);
        $this->mediator = $mediator;
        if($this->mediator !== null) $this->mediator->setDTO($this);
    }

    /**
     * @param string $group
     * @return self
     */
    public function addMappedGroup(string $group){
        if(! in_array($group,$this->groups)){
            $this->groups[] = $group;
        }
        return $this;
    }

    /**
     * @return array
     * @groups({"groups"})
     */
    public function getGroups(){
        return $this->groups;
    }

}