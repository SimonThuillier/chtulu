<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 05/08/19
 * Time: 21:53
 */

namespace App\Observer;


use App\Mediator\DTOMediator;
use App\Util\Command\EntityMapperCommand;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class DBActionObserver
{
    private $user;

    /** @var array observed ADD actions */
    private $addActions = [];
    /** @var array observed LINK actions */
    private $linkActions = [];
    /** @var array observed EDIT actions */
    private $editActions = [];
    /** @var array observed DELETE actions */
    private $deleteActions = [];

    private $entities = [];
    private $requests = [];

    public function __construct(TokenStorageInterface $tokenStorage)
    {
        $this->user = $tokenStorage->getToken()->getUser();
    }

    /**
     * drop all actions and reinitialize the to do list
     * @return $this
     */
    public function reinitialize(){
        $this->addActions = [];
        $this->linkActions = [];
        $this->editActions = [];
        $this->deleteActions = [];
        return $this;
    }

    /**
     * register a new action command to be executed later
     * @param EntityMapperCommand $action
     * @return $this
     */
    public function registerAction(EntityMapperCommand $action){
        switch ($action->getAction()){
            case EntityMapperCommand::ACTION_ADD:
                $this->addActions[$action->getEntityClassName().':'.$action->getId()] = $action;
                break;
            case EntityMapperCommand::ACTION_LINK:
                $this->linkActions[$action->getEntityClassName().':'.$action->getId()] = $action;
                break;
            case EntityMapperCommand::ACTION_EDIT:
                $this->editActions[$action->getEntityClassName().':'.$action->getId()] = $action;
                break;
            case EntityMapperCommand::ACTION_DELETE:
                $this->deleteActions[$action->getEntityClassName().':'.$action->getId()] = $action;
                break;
            default:
                break;
        }
        return $this;
    }



    public function notifyNewEntity($entityClassName,$id,$entity,$priority){

        $this->entities[$entityClassName . ':' . $id] = ['entity'=>$entity,'priority'=>$priority];

        if(array_key_exists($entityClassName . ':' . $id,$this->requests)){
            foreach($this->requests[$entityClassName . ':' . $id] as $request){
                $this->setEntity($entityClassName,$id,$request['mediator'],$request['entity'],$request['setterName']);
            }
        }
    }

    public function askNewEntity($entityClassName,$id,$mediator,$entity,$setterName){

        if(array_key_exists($entityClassName . ':' . $id,$this->entities)){
            $this->setEntity($entityClassName,$id,$mediator,$entity,$setterName);
        }
        else{
            if(!array_key_exists($entityClassName . ':' . $id,$this->requests)){
                $this->requests[$entityClassName . ':' . $id] = [];
            }
            $this->requests[$entityClassName . ':' . $id][] = [
                'mediator'=>$mediator,
                'entity'=>$entity,
                'setterName'=>$setterName
            ];
        }
    }

    /**
     * @param $entityClassName
     * @param $id
     * @param DTOMediator $mediator
     * @param $entity
     * @param $setterName
     * @return self
     */
    private function setEntity($entityClassName,$id,$mediator,$entity,$setterName){
        $subEntity = $this->entities[$entityClassName . ':' . $id]['entity'];
        $priority = $this->entities[$entityClassName . ':' . $id]['priority'];
        $entity->$setterName($subEntity);
        $mediator->setEntityPriority($priority-1);

        return $this;
    }


}