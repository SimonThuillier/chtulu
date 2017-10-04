<?php

namespace AppBundle\Entity;

abstract class AbstractBindableEntity{
    
    /**
     * @param mixed $dto
     */
    public function bindDTO($dto){    
        $class= get_class($dto);
        foreach($this as $key => $value) {
            if(property_exists($class, $key)){
                $dto->$key = $value;
            }
        }
    }
}