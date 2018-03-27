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
use AppBundle\Mapper\EntityMapper;

abstract class DTOMediator
{
    /** @var EntityMutableDTO */
    protected $dto;
    /** @var DTOMutableEntity */
    protected $entity;
    /** @var EntityMapper */
    protected $mapper;
    /** @var array */
    protected $groups;
    /** @var array */
    protected $changedProperties;
    /** @var boolean */
    private $pendingSetDTO;
    /** @var boolean */
    private $pendingSetEntity;
    /** @var boolean */
    protected $pendingSetMapper;
    /** @var boolean */
    protected $pendingSetting;

    /**
     * DTOBuilder constructor.
     */
    public function __construct()
    {
        $this->groups = [];
        $this->changedProperties = [];
        $this->pendingSetDTO = false;
        $this->pendingSetEntity = false;
        $this->pendingSetMapper = false;
        $this->pendingSetting = false;
    }

    /**
     * @param EntityMutableDTO|null $dto
     * @return $this
     */
    public function setDTO($dto){
        if($this->dto === $dto || $this->pendingSetDTO) return $this;
        $this->pendingSetDTO = true;
        if($this->dto !== null) $this->dto->setMediator(null);
        $this->dto = $dto;
        if($this->dto !== null) $this->dto->setMediator($this);
        $this->pendingSetDTO = false;
        return $this;
    }

    /**
     * @return mixed|null
     */
    public function getDTO(){
        return $this->dto;
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
     * @return mixed|null
     */
    public function getEntity(){
        return $this->entity;
    }

    /**
     * @param EntityMapper|null $mapper
     * @return $this
     */
    public function setMapper($mapper){
        if($this->mapper === $mapper || $this->pendingSetMapper) return $this;
        $this->pendingSetMapper = true;
        if($this->mapper !== null) $this->mapper->setMediator(null);
        $this->mapper = $mapper;
        if($this->mapper !== null) $this->mapper->setMediator($this);
        $this->pendingSetMapper = false;
        return $this;
    }

    /**
     * @return EntityMapper|null
     */
    public function getMapper(){
        return $this->mapper;
    }

    /**
     * @param string $group
     * @throws NotAvailableGroupException
     * @throws NullColleagueException
     * @return self
     */
    public function setDTOGroup(String $group){
        if($this->dto === null) throw new NullColleagueException("DTO must be instanciated to build its groups");
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
     * @var EntityMapper $mapper
     * @return array
     * @throws NullColleagueException
     * @throws InvalidCallerException
     */
    public function returnDataToEntity(EntityMapper $mapper){
        if($mapper !== $this->mapper) throw new NullColleagueException("DTO must be specified to return data");
        if($this->dto === null) throw new NullColleagueException("DTO must be specified to return data");
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
            else if(method_exists($this->dto,$dtoFunction) && method_exists($this->entity,$entityFunction)){
                $this->entity->$entityFunction($this->dto->$dtoFunction());
                $returnedProperties[] = $property;
            }
        }
        $this->resetChangedProperties();
        return $returnedProperties;
    }
}