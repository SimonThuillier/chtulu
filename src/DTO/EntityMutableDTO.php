<?php

namespace App\DTO;

use Symfony\Component\Serializer\Annotation\Groups;
use App\Mediator\DTOMediator;

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
    /** @var boolean */
    protected $toDelete=false;
    /** @var array */
    protected $errors;

    public function __construct()
    {
        $this->toDelete=false;
        $this->groups = [];
        $this->backGroups = ['minimal'=>true];
        $this->errors = [];
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
     * @return bool
     * @Groups({"minimal"})
     */
    public function getToDelete(): bool
    {
        return $this->toDelete;
    }

    /**
     * @param bool $toDelete
     * @return EntityMutableDTO
     */
    public function setToDelete(bool $toDelete): EntityMutableDTO
    {
        $this->toDelete = $toDelete;
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
    public function addBackGroups(?array $backGroups){
        if($backGroups !== null){
            $this->backGroups = array_merge($this->backGroups,$backGroups);
        }
        return $this;
    }

    /**
     * @return self
     */
    public function reinitializeBackGroups(){
        $this->backGroups = ['minimal'=>true];
        return $this;
    }

    /**
     * @return array
     * @groups({"minimal"})
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * @param array $errors
     * @return self
     */
    public function setErrors(array $errors)
    {
        $this->errors = $errors;
        return $this;
    }
}