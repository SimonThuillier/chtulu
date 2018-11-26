<?php

namespace AppBundle\DTO;

use Symfony\Component\Serializer\Annotation\Groups;
use AppBundle\Mediator\DTOMediator;

abstract class EntityMutableDTO
{
    /** @var integer */
    protected $oldId=0;
    /** @var integer */
    protected $id=0;
    /** @var DTOMediator */
    protected $mediator;
    /** @var array */
    protected $groups;
    /** @var array */
    protected $backGroups;

    public function __construct()
    {
        $this->groups = [];
        $this->backGroups = [];
    }

    /**
     * @return array
     * @Groups({"minimal"})
     */
    public function getLoadedGroups(){
        return $this->groups;
    }

    /**
     * @return int
     * @Groups({"minimal"})
     */
    public function getOldId()
    {
        return $this->oldId;
    }

    /**
     * @return int
     * @Groups({"minimal"})
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int
     * @return self
     */
    public function setId($id)
    {
        if(intval($id) !== intval($this->id)){
            $this->oldId = $this->id;
            $this->id = $id;
        }
        return $this;
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
     * @deprecated
     * @return array
     * @groups({"groups"})
     */
    public function getGroups(){
        return $this->groups;
    }

    /**
     * @return array
     * @groups({"minimal"})
     */
    public function getBackGroups(){
        return $this->backGroups;
    }

    /**
     * @param array
     * @return self
     */
    public function setBackGroups(?array $backGroups){
        $this->backGroups = $backGroups;
        return $this;
    }

    /**
     * when a post is done on a DTO we send back minimal groups to get the new id
     * @return array
     */
    public function getReturnGroups(){
        return ["minimal"=>true];
    }

}