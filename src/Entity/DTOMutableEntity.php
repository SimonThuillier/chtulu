<?php

namespace App\Entity;

use App\Mediator\DTOMediator;

abstract class DTOMutableEntity{

    /** @var DTOMediator */
    protected $mediator;

    /**
     * Get id
     * @return int
     */
    abstract public function getId() :?int;

    /**
     * @return DTOMediator||null
     */
    public function getMediator(){
        return $this->mediator;
    }

    /**
     * @param DTOMediator|null $mediator
     */
    public function setMediator($mediator){
        if($mediator === $this->mediator) return;
        if($this->mediator !== null) $this->mediator->setEntity(null);
        $this->mediator = $mediator;
        if($this->mediator !== null) $this->mediator->setEntity($this);
    }
}