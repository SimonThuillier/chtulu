<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 05/08/19
 * Time: 22:38
 */

namespace App\Util\Command;

use App\Entity\DTOMutableEntity;
use App\Util\ClearableInterface;

/**
 * Class EntityMapperCommand
 * @package App\Command
 * command representing an ORM action on the database
 */
class EntityMapperCommand implements ClearableInterface
{
    /** add a non already existing entity in DB */
    const ACTION_ADD=1;
    /** edit an entity to reference another entity (foreign key in DB) */
    const ACTION_LINK=2;
    /** edit an entity primary fields in DB */
    const ACTION_EDIT=3;
    /** delete an entity from the DB */
    const ACTION_DELETE=4;

    /** @var int one of class's constants */
    private $action;
    /** @var string className of the entity */
    private $entityClassName;
    /** @var int the original id of the subject entity (can be negative for non already-existing entity) */
    private $id;
    /** @var DTOMutableEntity|null the entity subject of the action */
    private $entity;
    /** @var int the priority of the action : among all actions of this type the highest is done first */
    private $priority=0;
    /** @var array array of EntityMapperCommands this command depends on,
     * e.g. that must be executed before this one is executed */
    private $dependencies = [];
    /** @var null|\DateTime  null if action has not been executed, the dateTime of execution end else */
    private $doneAt = null;

    /**
     * EntityMapperCommand constructor.
     * @param int $action
     * @param string $entityClassName
     * @param int $id
     * @param DTOMutableEntity|null $entity
     */
    public function __construct(
        int $action,
        string $entityClassName,
        int $id,
        ?DTOMutableEntity $entity
    )
    {
        $this->action = $action;
        $this->entityClassName = $entityClassName;
        $this->id = $id;
        $this->entity = $entity;
    }

    /**
     * @return int
     */
    public function getAction(): int
    {
        return $this->action;
    }

    /**
     * @return string
     */
    public function getEntityClassName(): string
    {
        return $this->entityClassName;
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return DTOMutableEntity|null
     */
    public function getEntity(): ?DTOMutableEntity
    {
        return $this->entity;
    }

    /**
     * @param DTOMutableEntity $entity
     * @return EntityMapperCommand
     */
    public function setEntity(DTOMutableEntity $entity): EntityMapperCommand
    {
        if($this->entity === null){
            $this->entity = $entity;
        }
        return $this;
    }

    /**
     * @return int
     */
    public function getPriority(): int
    {
        return $this->priority;
    }

    /**
     * @param int $priority
     * @return EntityMapperCommand
     */
    public function setPriority(int $priority): EntityMapperCommand
    {
        $this->priority = $priority;
        return $this;
    }

    /**
     * @return array
     */
    public function getDependencies(): array
    {
        return $this->dependencies;
    }

    /**
     * @param EntityMapperCommand $dependency
     * @return EntityMapperCommand
     */
    public function addDependency($dependency)
    {
        $this->dependencies[] = $dependency;
        return $this;
    }

    /**
     * @return \DateTime|null
     */
    public function getDoneAt(): ?\DateTime
    {
        return $this->doneAt;
    }

    /**
     * @param \DateTime|null $doneAt
     * @return EntityMapperCommand
     */
    public function setDoneAt(?\DateTime $doneAt): EntityMapperCommand
    {
        $this->doneAt = $doneAt;
        return $this;
    }

    /**
     * @return bool
     */
    public function isDone() : bool
    {
        return $this->doneAt!==null;
    }

    public function finishAndClear()
    {
        $this->dependencies = [];
        $this->entity = null;
    }
}