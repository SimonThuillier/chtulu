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
use App\Util\Command\LinkCommand;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class DBActionObserver
{
    /** for priority computation */
    const MAX_ITERATIONS = 20;

    private $user;

    /** @var array observed ADD actions */
    private $addActions = [];
    /** @var array observed LINK actions */
    private $linkActions = [];
    /** @var array observed EDIT actions */
    private $editActions = [];
    /** @var array observed DELETE actions */
    private $deleteActions = [];

    /** @var null|EntityMapperCommand a work property used to compute dependencies */
    private $currentWorkAction = null;

    /** @var bool indicating if the sequence of actions has already been made */
    private $hasComputedSequence = false;
    /** @var array sorted sequence of actions */
    private $sequenceOfActions = [];


    private $entities = [];
    private $requests = [];

    public function __construct(TokenStorageInterface $tokenStorage)
    {
        $this->user = $tokenStorage->getToken()->getUser();
    }

    /**
     * drop all actions and reinitialize the to do list
     * WARNING : must always be called by the client at the end of its operations !
     * @return $this
     */
    public function reinitialize()
    {
        $this->addActions = [];
        $this->linkActions = [];
        $this->editActions = [];
        $this->deleteActions = [];

        $this->currentWorkAction = null;

        $this->invalidateSequenceOfActions();

        return $this;
    }

    /**
     * invalidate the current sequence of actions
     */
    private function invalidateSequenceOfActions()
    {
        $this->hasComputedSequence = false;
        $this->sequenceOfActions = [];
    }

    /**
     * register a new action command to be executed later
     * @param EntityMapperCommand $action
     * @return $this
     */
    public function registerAction(EntityMapperCommand $action)
    {
        switch ($action->getAction()){
            case EntityMapperCommand::ACTION_ADD:
                $this->invalidateSequenceOfActions();
                $this->addActions[$action->getEntityClassName().':'.$action->getId()] = $action;
                break;
            case EntityMapperCommand::ACTION_LINK:
                $this->invalidateSequenceOfActions();
                /** @var LinkCommand $action */
                $this->linkActions[$action->getEntityClassName().':'.$action->getId() . ':' . $action->getLinkerMethodName()] = $action;
                break;
            case EntityMapperCommand::ACTION_EDIT:
                $this->invalidateSequenceOfActions();
                $this->editActions[$action->getEntityClassName().':'.$action->getId()] = $action;
                break;
            case EntityMapperCommand::ACTION_DELETE:
                $this->invalidateSequenceOfActions();
                $this->deleteActions[$action->getEntityClassName().':'.$action->getId()] = $action;
                break;
            default:
                break;
        }
        return $this;
    }

    /**
     * compute and returns the ordened sequence of actions necessary to pass to the entity mapper
     * the sequence is an array [priority => [actions of this priority]]
     * the actions can then be executed in decreasing order of priority by the mapper
     */
    public function getSequenceOfActions()
    {
       if($this->hasComputedSequence) return $this->sequenceOfActions;

       $this->computeActionDependencies();
        $addLinkActions = array_merge($this->addActions,$this->linkActions);
        /**
         * 1 : initialization of priority computation
         * each add/link with no dependency receive the -1 priority
         */
        /** @var EntityMapperCommand $action */
        foreach($addLinkActions as $action){
            if(empty($action->getDependencies())) $action->setPriority(-1);
        }

        $undefinedPriorityCount = array_reduce(
            $addLinkActions,
            function($count,EntityMapperCommand $action){return $count + ($action->getPriority()===0?1:0);},
            0);

        /**
         * 2 : loop of priority computation
         * each add/link with 0 priority get checked : if all dependencies have a valid priority (!=0)
         * its priority is set to the min of these priorities -1
         * this computation has a iteration limit of 10
         */
        $iteration = 0;
        while($undefinedPriorityCount>0 && $iteration < self::MAX_ITERATIONS){
            foreach($addLinkActions as $action){
                if($action->getPriority()===0){
                    $maxDependenciesPriority= array_reduce(
                        $action->getDependencies(),
                        function($max,EntityMapperCommand $action){return max($max,$action->getPriority());},
                        -(1+ $iteration)
                    );
                    if($maxDependenciesPriority < 0){
                        $minDependenciesPriority= array_reduce(
                            $action->getDependencies(),
                            function($min,EntityMapperCommand $action){return min($min,$action->getPriority());},
                            -(1+ $iteration)
                        );
                        $action->setPriority($minDependenciesPriority-1);
                    }
                }
            }
            $undefinedPriorityCount = array_reduce(
                $addLinkActions,
                function($count,EntityMapperCommand $action){return $count + ($action->getPriority()===0?1:0);},
                0);
            $iteration++;
        }

        $test='lol';
    }

    /**
     * compute the dependencies of each action registred by the observer,
     * e.g. the actions that must be performed before this action is
     */
    private function computeActionDependencies()
    {
        /** 1 : detect addActions which have some link dependencies,
         *  e.g. actions which corresponds to a subject of mandatory linkActions
         *  for instance an ArticleLink can't be added if its links have not been made
         **/
        foreach($this->addActions as $addAction){
            /** @var EntityMapperCommand $addAction */
            $this->currentWorkAction = $addAction;
            $dependencies = array_filter(
                array_values($this->linkActions),
                function(LinkCommand $linkAction)
                {
                    /** @var EntityMapperCommand $addAction */
                    $addAction = $this->currentWorkAction;
                    return (
                        $linkAction->isMandatory()
                        && $addAction->getEntityClassName() === $linkAction->getEntityClassName()
                        && $addAction->getId() === $linkAction->getId()
                    );
                }
            );

            foreach($dependencies as $dependency){
                $addAction->addDependency($dependency);
            }
        }
        $dependencies = [];
        $this->currentWorkAction = null;

        /** 2 : detect linkActions which have some add dependencies,
         *  e.g. link actions whose entityToLink is not already persisted to the DB
         *  for instance we can't associate a geometry to an article before this article is added
         **/
        foreach($this->linkActions as $linkAction){
            $this->currentWorkAction = $linkAction;
            $dependencies = array_filter(
                array_values($this->addActions),
                function(EntityMapperCommand $addAction)
                {
                    /** @var LinkCommand $linkAction */
                    $linkAction = $this->currentWorkAction;
                    return (
                        $linkAction->getEntityToLinkClassName() === $addAction->getEntityClassName()
                        && $linkAction->getIdToLink() === $addAction->getId()
                    );
                }
            );

            foreach($dependencies as $dependency){
                $linkAction->addDependency($dependency);
            }
        }

        $dependencies = [];
        $this->currentWorkAction = null;
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