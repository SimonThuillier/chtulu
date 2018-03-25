<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:49
 */

namespace AppBundle\Mediator;


use AppBundle\DTO\EntityMutableDTO;
use AppBundle\Entity\DTOMutableEntity;

abstract class DTOMediator
{
    /** @var EntityMutableDTO */
    protected $DTO;
    /** @var DTOMutableEntity */
    protected $entity;
    /** @var array */
    protected $groups;
    /** @var array */
    protected $changedProperties;
    /** @var boolean */
    private $pendingSetEntity;
    /** @var boolean */
    private $pendingSetDTO;
    /** @var boolean */
    protected $pendingSetting;

    /**
     * DTOBuilder constructor.
     */
    public function __construct()
    {
        $this->groups = [];
        $this->changedProperties = [];
        $this->pendingSetEntity = false;
        $this->pendingSetDTO = false;
        $this->pendingSetting = false;
    }

    /**
     * @param EntityMutableDTO|null $DTO
     * @return $this
     */
    public function setDTO($DTO){
        if($this->DTO === $DTO || $this->pendingSetDTO) return $this;
        $this->pendingSetDTO = true;
        if($this->DTO !== null) $this->DTO->setMediator(null);
        $this->DTO = $DTO;
        if($this->DTO !== null) $this->DTO->setMediator($this);
        $this->pendingSetDTO = false;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDTO(){
        return $this->DTO;
    }

    /**
     * @param DTOMutableEntity|null $entity
     * @return $this
     */
    public function setEntity($entity){
        if($this->entity === $entity || $this->pendingSetEntity) return $this;
        $this->pendingSetEntity = true;
        if($this->entity !== null) $this->entity->setMediator(null);
        $this->entity = $entity;
        if($this->entity !== null) $this->entity->setMediator($this);
        $this->pendingSetEntity = false;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getEntity(){
        return $this->entity;
    }

    /**
     * @param string $group
     * @throws NotAvailableGroupException
     * @throws NullColleagueException
     * @return self
     */
    public function setDTOGroup(String $group){
        if($this->DTO === null) throw new NullColleagueException("DTO must be instanciated to build its groups");
        if($this->entity === null) throw new NullColleagueException("Entity must be specified to receive data");
        if(! in_array($group,array_keys($this->groups))){
            throw new NotAvailableGroupException("Group " . $group . " is not available for DTOMediator " . self::class);
        }
        $this->pendingSetting = true;
        return $this;
    }

    /**
     * @param array $groups
     * @throws NotAvailableGroupException
     * @throws NullColleagueException
     * @return self
     */
    public function setDTOGroups(array $groups){
        foreach($groups as $group){
            $this->setDTOGroup($group);
        }
        return $this;
    }

    /**
     * @param $name
     * @return self
     */
    public function notifyChangeOfProperty($name){
        if(! $this->pendingSetting){
            if(! in_array($name,$this->changedProperties)){
                $this->changedProperties[] = $name;
            }
        }
        return $this;
    }

    /**
     * @return array
     */
    public function getChangedProperties(): array
    {
        return $this->changedProperties;
    }

    /**
     * @return $this
     */
    public function resetChangedProperties(){
        $this->changedProperties = [];
        return $this;
    }

    /**
     * @return array
     * @throws NullColleagueException
     */
    public function returnDataToEntity(){
        if($this->DTO === null) throw new NullColleagueException("DTO must be specified to return data");
        if($this->entity === null) throw new NullColleagueException("Entity must be specified to receive data");
        $propertiesToReturn = array_unique($this->changedProperties);
        $returnedProperties = [];

        foreach($propertiesToReturn as $property){
            $mediatorFunction = 'mediate' . ucfirst($property);
            $dtoFunction = 'get' . ucfirst($property);
            $entityFunction = 'set' . ucfirst($property);

            if(method_exists ($this,$mediatorFunction)){
                $this->$mediatorFunction();
                $returnedProperties[] = $property;
            }
            else if(method_exists($this->DTO,$dtoFunction) && method_exists($this->entity,$entityFunction)){
                $this->entity->$entityFunction($this->DTO->$dtoFunction());
                $returnedProperties[] = $property;
            }
        }
        $this->resetChangedProperties();
        return $returnedProperties;
    }
}