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
    /** @var string */
    protected $password;
    /** @var string */
    protected $formTypeClassName;
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
        $this->pendingSetMapper = false;
        $this->password = static::generateSalt();
    }

    /**
     * @return string
     */
    public function getFormTypeClassName(): string
    {
        return $this->formTypeClassName;
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
     * @param EntityMapper|null $mapper
     * @return $this
     */
    public function setMapper($mapper){
        if($this->mapper === $mapper || $this->pendingSetMapper) return $this;
        $this->pendingSetMapper = true;
        if($this->mapper !== null){
            $this->mapper->setMediator(null);
            $this->mapper->setMediatorPassword(null);
        }
        $this->mapper = $mapper;
        if($this->mapper !== null){
            $this->mapper->setMediator($this);
            $this->mapper->setMediatorPassword($this->password);
        }
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
    public function mapDTOGroup(String $group){
        if($this->dto === null) throw new NullColleagueException("DTO must be instanciated to build its groups");
        if($this->entity === null) throw new NullColleagueException("Entity must be specified to receive data");
        if(! in_array($group,$this->groups)){
            throw new NotAvailableGroupException("Group " . $group . " is not available for DTOMediator " . self::class);
        }
        return $this;
    }

    /**
     * @param array $groups
     * @throws NotAvailableGroupException
     * @throws NullColleagueException
     * @return self
     */
    public function mapDTOGroups(array $groups){
        foreach($groups as $group){
            $this->mapDTOGroup($group);
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
     * @throws InvalidCallerException
     */
    public function returnDataToEntity(string $password){
        if($this->mapper === null) throw new NullColleagueException("Mapper must be specified to return data");
        if($password !== $this->password) throw new InvalidCallerException("
        password isn't the one attributed by the mediator : only mediator's mapper can request entity creation/modification");
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
     * generate custom password to give to colleague
     * @param integer $length
     * @return string
     */
    static private function generateSalt($length=10){
        $chars = str_shuffle("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" . (new \DateTime())->format('His'));
        $salt="";
        for($i=0;$i<$length;$i++){
            $salt.=substr($chars,mt_rand(0,strlen($chars)),1);
        }
        return substr(md5($salt),0,255);
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