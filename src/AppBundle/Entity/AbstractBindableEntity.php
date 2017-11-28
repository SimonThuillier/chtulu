<?php

namespace AppBundle\Entity;

abstract class AbstractBindableEntity{
    
    /**
     * @param mixed $dto
     */
    public function bindDTO($object){
        foreach ($this as $key => $value) {
                $object->$key = $value;
        }
    }
}