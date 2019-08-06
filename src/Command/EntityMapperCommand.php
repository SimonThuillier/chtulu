<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 05/08/19
 * Time: 22:38
 */

namespace App\Command;


use App\DTO\EntityMutableDTO;

class EntityMapperCommand
{
    /** @var int */
    private $action;
    /** @var int */
    private $priority=0;
    /** @var EntityMutableDTO */
    private $dto;

    const ACTION_ADD=1;
    const ACTION_EDIT=2;
    const ACTION_DELETE=3;

    /**
     * EntityMapperCommand constructor.
     * @param int $action
     * @param int $priority
     * @param EntityMutableDTO $dto
     */  
    public function __construct(int $action, int $priority, EntityMutableDTO $dto)
    {
        $this->action = $action;
        $this->priority = $priority;
        $this->dto = $dto;
    }

    /**
     * @return int
     */
    public function getAction(): int
    {
        return $this->action;
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
     * @return EntityMutableDTO
     */
    public function getDto(): EntityMutableDTO
    {
        return $this->dto;
    }
}