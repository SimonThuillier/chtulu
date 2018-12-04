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
use AppBundle\Factory\MediatorFactory;
use Psr\Container\ContainerInterface;
use Symfony\Component\DependencyInjection\ServiceSubscriberInterface;

abstract class DTOMediator implements ServiceSubscriberInterface
{
    /** @var string */
    public $entityClassName;
    /** @var string */
    public $dtoClassName;
    /** @var EntityMutableDTO */
    protected $dto;
    /** @var DTOMutableEntity */
    protected $entity;
    /** @var array */
    protected $groups;
    /** @var array */
    protected $changedProperties;
    /** @var ContainerInterface */
    protected $locator;
    /** @var boolean */
    private $pendingSetDTO;
    /** @var boolean */
    private $pendingSetEntity;
    /** @var int */
    protected $mode;

    public const CREATE_IF_NULL=1;
    public const ERROR_IF_NULL=2;
    public const NOTHING_IF_NULL=3;

    /**
     * DTOBuilder constructor.
     * @param ContainerInterface $locator
     */
    public function __construct(ContainerInterface $locator)
    {
        $this->locator = $locator;
        $this->groups = [];
        $this->changedProperties = [];
        $this->pendingSetDTO = false;
        $this->pendingSetEntity = false;
    }

    /**
     * @return string
     */
    public function getEntityClassName(): string
    {
        return $this->entityClassName;
    }

    /**
     * @return string
     */
    public function getDtoClassName(): string
    {
        return $this->dtoClassName;
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
        return $this;
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
     * @param int $mode
     * @param array|null $subGroups
     * @throws NotAvailableGroupException
     * @throws NullColleagueException
     * @return self
     */
    protected function mapDTOGroup(String $group,$mode = self::CREATE_IF_NULL,?array $subGroups=null)
    {
        if($this->dto === null) throw new NullColleagueException("DTO must be instanciated to build its groups");
        if($this->entity === null) throw new NullColleagueException("Entity must be specified to receive data");
        if(! in_array($group,$this->groups)){
            throw new NotAvailableGroupException("Group " . $group . " is not available for DTOMediator " . self::class);
        }

        $function = 'mapDTO' . ucfirst($group) . 'Group';
        if(!method_exists($this,$function)) return $this;

        if($subGroups === null) $this->$function($mode);
        else {
            try{
                $this->$function($mode,$subGroups);
            }
            catch(\Exception $e) {
                throw new NotAvailableGroupException("Group " . $group . " doesn't support subGroups in DTOMediator " . self::class . $e->getMessage());
            }
        }
        $this->getDTO()->addMappedGroup(lcfirst($group));
        return $this;
    }

    /**
     * if groups is null or not given all groups are mapped
     * @param array|null $groups
     * @param int $mode
     * @throws NotAvailableGroupException
     * @throws NullColleagueException
     * @return self
     */
    public function mapDTOGroups(?array $groups=null,$mode = self::CREATE_IF_NULL){
        if ($groups === null) $groups = $this->getAvailableGroups();
        if(!array_key_exists("minimal",$groups) || !array_search("minimal",$groups)){
            $groups = array_merge(["minimal"=>true],$groups);
        }
        foreach($groups as $k => $v){
            if(is_numeric($k)) $this->mapDTOGroup($v,$mode);
            elseif(is_string($k) && is_bool($v)) $this->mapDTOGroup($k,$mode);
            elseif(is_string($k) && is_array($v)) $this->mapDTOGroup($k,$mode,$v);
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
     * @param array $mapperCommands
     * @var string $password
     * @return array
     * @throws NullColleagueException
     */
    public function returnDataToEntity($mapperCommands=[]){
        if($this->dto === null) throw new NullColleagueException("DTO must be specified to return data");
        if($this->entity === null) throw new NullColleagueException("Entity must be specified to receive data");
        $propertiesToReturn = array_unique($this->changedProperties);
        if(count($propertiesToReturn) < 1) return $mapperCommands;

        $id = intval($this->dto->getId());
        $toDelete = $this->dto->getToDelete();
        $mapperCommands[$this->dtoClassName . ":" . $id] = ["action"=>($toDelete?"delete":($id>0?"edit":"add")),"dto"=>$this->dto];

        if(!$toDelete){
            foreach($propertiesToReturn as $property){
                $mapperCommands = $this->mediate($property,$mapperCommands);
            }
        }

        $this->resetChangedProperties();
        return $mapperCommands;
    }

    /**
     * @param string $property
     * @param array $mapperCommands
     * @return array
     */
    protected function mediate(string $property, array $mapperCommands=[]){
        $mediatorFunction = 'mediate' . ucfirst($property);
        $dtoFunction = 'get' . ucfirst($property);
        $entityFunction = 'set' . ucfirst($property);

        if(method_exists ($this,$mediatorFunction)){
            $mapperCommands = $this->$mediatorFunction($mapperCommands);
        }
        else if(method_exists($this->dto,$dtoFunction) && method_exists($this->entity,$entityFunction)){
            $this->entity->$entityFunction($this->dto->$dtoFunction());
        }
        return $mapperCommands;
    }
}