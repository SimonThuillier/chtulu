<?php
namespace AppBundle\Mapper;

/**
 * 
 * @author belze (sthuillier1988@gmail.com)
 * Helper class with static methods allowing to automatically and easily map data between objects
 */
class AutoMapper
{
    /**
     * generic mapper between two objects or arrays
     * @param mixed $input
     * @param mixed $output
     * @param string $mapPrefix
     * @param array|null $fields
     * @param array|null $excludedFields
     * @return array
     */
    static function map(&$input,&$output,$mapPrefix='',$fields=null,$excludedFields=null)
    {
        if($input === null || $output === null || 
            !(self::is_assoc($input) || is_object($input)) ||
            !(self::is_assoc($output) || is_object($output))){
            return [];
        }
        // $input structure
        $inputStruct = self::getReadableStructure($input);
        // reduce mapping perimeter with fields and excludedFields if defined
        if($fields !==null && is_array($fields)) $inputStruct = array_intersect_key($inputStruct,array_flip($fields));
        if($excludedFields !==null && is_array($excludedFields)) $inputStruct = array_diff_key($inputStruct,array_flip($excludedFields));
        if($inputStruct ===[]) return [];
        // output structure
        $outputStruct = self::getWritableStructure($output);
        if($outputStruct ===[]) return [];
        // compute mapping 
        $mapping = [];
        foreach($inputStruct as $key => $value){$mapping[$key] = ($mapPrefix=='')?$key:$mapPrefix . ucfirst($key);}
        $mapping = array_flip(array_intersect_key(array_flip($mapping),$outputStruct));
        if($mapping ===[]) return [];
        // else let's do the magic
        foreach($mapping as $iField => $oField){
            switch($inputStruct[$iField]){
                case "key" : $value = $input[$iField]; break;
                case "property" : $value = $input->$iField; break;
                case "method" : 
                    $func = method_exists($input,'get' . $iField)?'get' . $iField:'is' . $iField;
                    $value = $input->$func(); break;
                default: $value = null; break;
            }
            switch($outputStruct[$oField]){
                case "key" : $output[$oField]= $value; break;
                case "property" : $output->$oField = $value; break;
                case "method" : $func = 'set' . $oField;$output->$func($value); break;
                default: $value = null; break;
            }
        }
        return $mapping;
    }
    
    /**
     * for associative arrays or objects returns an array of their properties indicating if they can be accessed as
     * array key : "key"
     * as public property : "property"
     * with a method : "method"
     * @param mixed $var
     * @return array
     */
    static function getStructure(&$var)
    {
        if($var === null || !(self::is_assoc($var) || is_object($var))){ return [];}
        if(is_array($var)){ 
            $keys = array_keys($var);
            $values = array_fill(0,count($keys),"key");
             return array_combine($keys,$values);
        }
        if(is_object($var)){
            $global = array_keys((array) $var);
            $structure = [];
            foreach($global as $attribute){
                $separatedKey = explode("\0",$attribute);
                if(count($separatedKey)>1){
                    $structure[end($separatedKey)] = "method";
                    continue;
                }
                $structure[$attribute] = "property";
            }
            return $structure;
        }
        return []; 
    }
    
    /**
     * for associative arrays or objects returns an array of their properties indicating if they can be accessed as
     * array key : "key"
     * with a public getter method : "method"
     * as public property : "property"
     * property non readable are not included
     * @param mixed $var
     * @return array
     */
    static function getReadableStructure(&$var)
    {
        $structure = self::getStructure($var);
        if($structure === []) return $structure;
        
        foreach($structure as $key => $value){
            if($value === "method" && !method_exists($var,'get' . $key)){
                unset($structure[$key]);
            }
        }
        return $structure;
    }
    
    /**
     * for associative arrays or objects returns an array of their properties indicating if they can be written as
     * array key : "key"
     * with a public getter method : "method"
     * as public property : "property"
     * property non writable are not included
     * @param mixed $var
     * @return array
     */
    static function getWritableStructure(&$var)
    {
        $structure = self::getStructure($var);
        if($structure === []) return $structure;
        
        foreach($structure as $key => $value){
            if($value === "method" && !method_exists($var,'set' . $key) && !method_exists($var,'is' . $key)){
                unset($structure[$key]);
            }
        }
        return $structure;
    }
    
    /**
     * returns if a variable is an associative array
     * @param mixed $var
     * @return boolean
     */
    private static function is_assoc(&$var) {
        return is_array($var) and (array_values($var) !== $var);
    }
    
    
    /*
     *   DEPRECATED  
    
    
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
     */
    
}