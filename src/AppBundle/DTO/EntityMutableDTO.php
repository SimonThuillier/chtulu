<?php

namespace AppBundle\DTO;

use Symfony\Component\Serializer\Annotation\Groups;
use AppBundle\Mediator\DTOMediator;

abstract class EntityMutableDTO {

    /** @var DTOMediator */
    protected $mediator;
    /** @var array */
    protected $groups;

    public function getId(){
        return 0;
    }

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
     * @param boolean|array $subGroups
     * @return self
     */
    public function addMappedGroup(string $group,$subGroups=true){
        if(! array_key_exists($group,$this->groups)){
            $this->groups[$group] = $subGroups;
        }
        return $this;
    }

    /**
     * @return array
     */
    public abstract function getLoadedGroups();

    /**
     * @return array
     * @groups({"groups"})
     */
    public function getGroups(){
        return $this->groups;
    }

    /**
     * when a post is done on a DTO we send back minimal groups to get the new id
     * @return array
     */
    public function getReturnGroups(){
        return [];
    }

}