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
use Symfony\Component\Routing\Router;

abstract class DTOMediator
{
    /** @var EntityMutableDTO */
    protected $dto;
    /** @var DTOMutableEntity */
    protected $entity;
    /** @var array */
    protected $groups;
    /** @var array */
    protected $changedProperties;
    /** @var boolean */
    private $pendingSetDTO;
    /** @var boolean */
    private $pendingSetEntity;
    /** @var string */
    protected $password;
    /** @var Router */
    protected $router;

    /**
     * DTOBuilder constructor.
     */
    public function __construct()
    {
        $this->groups = [];
        $this->changedProperties = [];
        $this->pendingSetDTO = false;
        $this->pendingSetEntity = false;
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
        return $this->resetChangedProperties();
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
        return $this->resetChangedProperties();
    }

    /**
     * @return mixed|null
     */
    public function getEntity(){
        return $this->entity;
    }

    /**
     * @return array
     */
    public function getAvailableGroups():array{
        return $this->groups;
    }

    /**
     * @param string $group
     * @param array|null $subGroups
     * @throws NotAvailableGroupException
     * @throws NullColleagueException
     * @return self
     */
    protected function mapDTOGroup(String $group,?array $subGroups=null)
    {
        if($this->dto === null) throw new NullColleagueException("DTO must be instanciated to build its groups");
        if($this->entity === null) throw new NullColleagueException("Entity must be specified to receive data");
        if(! in_array($group,$this->groups)){
            throw new NotAvailableGroupException("Group " . $group . " is not available for DTOMediator " . self::class);
        }

        $function = 'mapDTO' . ucfirst($group) . 'Group';

        if($subGroups === null) $this->$function();
        else {
            try{
                $this->$function($subGroups);
            }
            catch(\Exception $e) {
                throw new NotAvailableGroupException("Group " . $group . " doesn't support subGroups in DTOMediator " . self::class);
            }
        }
        return $this;
    }

    /**
     * if groups is null or not given all groups are mapped
     * @param array|null $groups
     * @throws NotAvailableGroupException
     * @throws NullColleagueException
     * @return self
     */
    public function mapDTOGroups(?array $groups=null){
        if ($groups === null) $groups = $this->getAvailableGroups();
        foreach($groups as $k => $v){
            if(is_numeric($k)) $this->mapDTOGroup($v);
            elseif(is_string($k) && is_array($v)) $this->mapDTOGroup($k,$v);
            else throw new NotAvailableGroupException(
                "Groups elements must be either a string or a string referencing an array of subgroups");
        }
        return $this;
    }

    /**
     * @param $name
     * @return self
     */
    public function notifyChangeOfProperty($name){
        if(! in_array($name,$this->changedProperties)){
                $this->changedProperties[] = $name;
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
     * this function returns data of mediator DTO to it's entity
     * it's protected so that only the colleague mapper of the mediator can call it
     * @var string $password
     * @return array
     * @throws NullColleagueException
     */
    public function returnDataToEntity(){
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

    /**
     * @return Router
     */
    public function getRouter()
    {
        return $this->router;
    }

    /**
     * @param Router $router
     * @return DTOMediator
     */
    public function setRouter(Router $router): DTOMediator
    {
        $this->router = $router;
        return $this;
    }





}