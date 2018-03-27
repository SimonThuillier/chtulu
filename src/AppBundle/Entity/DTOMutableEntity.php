<?php

namespace AppBundle\Entity;

use AppBundle\Mediator\DTOMediator;

abstract class DTOMutableEntity{

    /** @var DTOMediator */
    protected $mediator;

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