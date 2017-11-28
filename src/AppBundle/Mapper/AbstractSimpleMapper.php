<?php
namespace AppBundle\Mapper;

abstract class AbstractSimpleMapper
{
    static function affect($inputObject,$outputObject,$inputField,$outputField)
    {
        $getter = self::getGetter($inputObject, $inputField);
        $inputProperty = property_exists($inputObject, $inputField);
        if ($getter === null && $inputProperty !== true){
            throw new \Exception('field ' . $inputField . ' or its Getter doesn\'t exist in object of class ' . get_class($inputObject));
        }
        
        $setter = self::getSetter($outputObject, $outputField);
        $outputProperty = property_exists($outputObject, $outputField);
        if ($setter === null && $outputProperty !== true){
            throw new \Exception('field ' . $outputField . ' or its Setter doesn\'t exist in object of class ' . get_class($inputObject));
        }
        
        if($setter !== null){
            $outputObject->$setter(($getter !== null)?$inputObject->$getter():$inputObject->$inputField);
            return;
        }
        $outputObject->$outputField = (($getter !== null)?$inputObject->$getter():$inputObject->$inputField);
        return;
    }
    
    static function getGetter($object,$field)
    {
        if(method_exists($object,'get' . $field)){return 'get' . $field;}
        else if(method_exists($object,'is' . $field)){return 'is' . $field;}
        return null;
    }
    
    static function getSetter($object,$field)
    {
        if(method_exists($object,'set' . $field)){return 'set' . $field;}
        return null;
    }
    
}