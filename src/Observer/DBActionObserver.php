<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 05/08/19
 * Time: 21:53
 */

namespace App\Observer;


use App\Util\ClearableInterface;
use App\Util\Command\EntityMapperCommand;
use App\Util\Command\LinkCommand;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class DBActionObserver implements ClearableInterface
{
    /** for priority computation */
    const MAX_ITERATIONS = 20;

    private $user;
    /** @var ManagerRegistry */
    protected $doctrine;

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

    /**
     * DBActionObserver constructor.
     * @param TokenStorageInterface $tokenStorage
     * @param ManagerRegistry $doctrine
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        ManagerRegistry $doctrine
    )
    {
        $this->user = $tokenStorage->getToken()->getUser();
        $this->doctrine = $doctrine;
    }

    /**
     * drop all actions and reinitialize the to do list
     * WARNING : must always be called by the client at the end of its operations !
     * @return $this
     */
    public function finishAndClear()
    {
        $actions = array_merge(
            array_values($this->addActions),
            array_values($this->editActions),
            array_values($this->linkActions),
            array_values($this->deleteActions)
        );

        foreach($actions as $action){
            /** @var EntityMapperCommand $action */
            $action->finishAndClear();
        }

        unset($actions);

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
                if(intval($action->getId())<1){
                    $this->invalidateSequenceOfActions();
                    $this->addActions[$action->getEntityClassName().':'.$action->getId()] = $action;
                }
                break;
            case EntityMapperCommand::ACTION_LINK:
                $this->invalidateSequenceOfActions();
                /** @var LinkCommand $action */
                $this->linkActions[$action->getEntityClassName().':'.$action->getId() . ':' . $action->getLinkerMethodName()] = $action;
                break;
            case EntityMapperCommand::ACTION_EDIT:
                if(intval($action->getId())>0) {
                    $this->invalidateSequenceOfActions();
                    $this->editActions[$action->getEntityClassName() . ':' . $action->getId()] = $action;
                }
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
     * @return array
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

        /**
         * 3 & 4 : TODO priority computation about delete ?
         * see when a decision about delete is made : should it be a real delete or an inactivation of the entity ?
         */

        /**
         * 5 : constitution of the sequence of action
         * 5.1 : edit actions are added with the default -1 priority
         * 5.2 : then we loop until all edit and add actions are placed in the sequence
         * 5.3 : delete actions are for the moment placed with -20 priority
         */
        $sequence = [];

        /** 5.1 */
        $chunk = [];
        /** @var EntityMapperCommand $action */
        foreach($this->editActions as $action){
            $action->setPriority(-1);
            $chunk[] = $action;
        }
        $sequence[-1] = $chunk;

        /** 5.2 */
        /** @var EntityMapperCommand $action */
        $priority = -1;
        $placedAddLinkCount = 0;

        while($placedAddLinkCount < count($addLinkActions)){
            foreach($addLinkActions as $action){
                if($priority === $action->getPriority()){
                    $chunk[] = $action;
                    $placedAddLinkCount++;
                }
            }
            if(count($chunk)>0){
                $sequence[$priority] = $chunk;
            }
            $chunk = [];
            $priority--;
        }

        /** 5.3 */
        $chunk = [];
        foreach($this->deleteActions as $action){
            $chunk[] = $action;
        }
        if(count($chunk)>0){
            $sequence[-self::MAX_ITERATIONS-1] = $chunk;
        }

        $this->hasComputedSequence = true;
        $this->sequenceOfActions = $sequence;
        return $sequence;
    }

    /**
     * compute the dependencies of each action registred by the observer,
     * e.g. the actions that must be performed before this action is
     * for actions this method can, if entity or entityToLink has not been previously set, set it
     */
    private function computeActionDependencies()
    {
        /** 0 : since for flexibility reason entity is now optional for edit and delete actions
         * we now try to load entities of this action, if required
         */
        foreach($this->editActions as $editAction){
            /** @var EntityMapperCommand $editAction */
            if($editAction->getEntity() === null && intval($editAction->getId())>0){
                $entity = $this->doctrine->getRepository($editAction->getEntityClassName())
                    ->find(intval($editAction->getId()));
                if($entity !== null){
                    $editAction->setEntity($entity);
                }
            }
        }
        foreach($this->deleteActions as $deleteAction){
            /** @var EntityMapperCommand $deleteAction */
            if($deleteAction->getEntity() === null && intval($deleteAction->getId())>0){
                $entity = $this->doctrine->getRepository($deleteAction->getEntityClassName())
                    ->find(intval($deleteAction->getId()));
                if($entity !== null){
                    $deleteAction->setEntity($entity);
                }
            }
        }


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
         *  if entityToLink has not been previously set, set it
         **/
        foreach($this->linkActions as $linkAction){
            /** @var LinkCommand $linkAction */
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
                /** @var EntityMapperCommand $dependency */
                $linkAction->addDependency($dependency);
                // set entity in case of link to non existent (dependency add link)
                if($linkAction->getEntityToLink() === null){
                    $linkAction->setEntityToLink($dependency->getEntity());
                }
            }
            // set entity in case of link to existent (find in the repository)
            if($linkAction->getEntityToLink() === null && intval($linkAction->getIdToLink())>0){
                $entityToLink = $this->doctrine->getRepository($linkAction->getEntityToLinkClassName())
                    ->find(intval($linkAction->getIdToLink()));
                if($entityToLink !== null){
                    $linkAction->setEntityToLink($entityToLink);
                }
            }
        }

        $dependencies = [];
        $this->currentWorkAction = null;
    }

    /**
     * returns an array of all entities concerned by a previously executed action to the database
     * keyed by entityClassName:entityId
     */
    public function getModifiedEntities(){
        $entities = [];

        $actions = array_merge(
            array_values($this->addActions),
            array_values($this->editActions),
            array_values($this->linkActions),
            array_values($this->deleteActions)
        );

        foreach($actions as $action){
            /** @var EntityMapperCommand $action */
            if($action->isDone()){
                $entities[$action->getEntityClassName() . ':' . $action->getEntity()->getId()]
                    = $action->getEntity();
            }
        }
        return $entities;
    }
}