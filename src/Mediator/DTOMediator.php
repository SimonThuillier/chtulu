<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:49
 */

namespace App\Mediator;


use App\Entity\User;
use App\Util\AuthorizationBag;
use App\Util\ClearableInterface;
use App\Util\Command\EntityMapperCommand;
use App\DTO\EntityMutableDTO;
use App\Entity\DTOMutableEntity;
use App\Observer\DBActionObserver;
use App\Util\ArrayUtil;
use Psr\Container\ContainerInterface;
use Symfony\Component\DependencyInjection\ServiceSubscriberInterface;

abstract class DTOMediator implements ServiceSubscriberInterface,ClearableInterface
{
    /** @var String */
    protected $entityClassName;
    /** @var String */
    protected $dtoClassName;

    /** @var EntityMutableDTO */
    protected $dto;
    /** @var DTOMutableEntity */
    protected $entity;
    /** @var User|null */
    protected $user;
    /** @var AuthorizationBag */
    protected $authorizationBag;
    /** @var array */
    protected $groups;
    /** @var array */
    protected $changedProperties;
    /** @var ContainerInterface */
    protected $locator;
    /** @var DBActionObserver */
    protected $dbActionObserver;
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
     * @param DBActionObserver $dbActionObserver
     * @param User|null $user
     */
    public function __construct(ContainerInterface $locator, DBActionObserver $dbActionObserver,?User $user)
    {
        $this->locator = $locator;
        $this->groups = [];
        $this->changedProperties = [];
        $this->pendingSetDTO = false;
        $this->pendingSetEntity = false;
        $this->dbActionObserver = $dbActionObserver;
        $this->user = $user;
    }

    protected abstract function setAuthorizationBag();

    /**
     * unlink entities and dto to allow garbage collector to clear memory
     * @return $this
     */
    public function finishAndClear()
    {
        if($this->dto !== null) $this->dto->setMediator(null);
        $this->dto = null;
        $this->pendingSetDTO = false;
        if($this->entity !== null) $this->entity->setMediator(null);
        $this->entity = null;
        $this->pendingSetEntity = false;

        $this->groups = [];
        $this->changedProperties = [];

        return $this;
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
    public function setDTO($dto)
    {
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
    public function getDTO()
    {
        return $this->dto;
    }

    /**
     * @param DTOMutableEntity|null $entity
     * @return $this
     */
    public function setEntity($entity)
    {
        if($this->entity === $entity || $this->pendingSetEntity) return $this;
        $this->pendingSetEntity = true;
        if($this->entity !== null) $this->entity->setMediator(null);
        $this->entity = $entity;
        if($this->entity !== null) $this->entity->setMediator($this);
        $this->pendingSetEntity = false;
        $this->resetChangedProperties();
        return $this;
    }

    /**
     * @return mixed|null
     */
    public function getEntity()
    {
        return $this->entity;
    }

    /**
     * @return array
     */
    public function getAvailableGroups():array
    {
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
    public function mapDTOGroups(?array $groups=null,$mode = self::CREATE_IF_NULL)
    {
        $this->setAuthorizationBag();

        $this->dto
            ->setId($this->entity->getId())
            ->setAuthorizationBag($this->authorizationBag)
        ;

        if(!$this->authorizationBag->isAllowed(AuthorizationBag::READ)) return $this;
        if ($groups === null) $groups = ArrayUtil::normalizeGroups($this->getAvailableGroups());
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
     * @throws NullColleagueException
     * @return bool
     */
    public function returnDataToEntity()
    {
        if($this->dto === null) throw new NullColleagueException("DTO must be specified to return data");
        if($this->entity === null) throw new NullColleagueException("Entity must be specified to receive data");
        $propertiesToReturn = array_unique($this->changedProperties);
        if(count($propertiesToReturn) < 1) return true;

        $id = intval($this->dto->getId());
        $toDelete = $this->dto->getToDelete();

        if(!$toDelete){
            foreach($propertiesToReturn as $property){
                $this->mediate($property);
            }
            $this->dbActionObserver->registerAction(
                new EntityMapperCommand(
                    $id > 0?EntityMapperCommand::ACTION_EDIT:EntityMapperCommand::ACTION_ADD,
                    $this->getEntityClassName(),
                    $id,
                    $this->entity
                )
            );
        }
        else if($id>0){
            if(method_exists($this,'onDelete'))  $this->onDelete();
            $this->dbActionObserver->registerAction(
                new EntityMapperCommand(
                    EntityMapperCommand::ACTION_DELETE,
                    $this->getEntityClassName(),
                    $id,
                    $this->entity
                )
            );
        }

        $this->resetChangedProperties();

        return true;
    }

    /**
     * @param string $property
     * @param array $mapperCommands
     * @return array
     */
    protected function mediate(string $property, array $mapperCommands=[])
    {
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

    protected function mediateAuthorizationBag()
    {
        // nothing
    }

    /**
     * this function is called when a delete is performed to trigger some particular actions
     */
    //abstract protected function onDelete();

}