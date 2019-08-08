<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 26/06/18
 * Time: 21:42
 */

namespace App\Util;


class ArrayUtil
{
    public static function flatten(?array $array,&$subArray=[])
    {
        if ($array === null) return null;
        $resultArray = [];
        foreach($array as $k => $v){
            if(is_numeric($k)) $resultArray[] = $v;
            elseif(is_string($k)) {
                $resultArray[] = $k;
                $subArray[$k] = $v;
            }
        }
        return $resultArray;
    }

    public static function filter(array $sourceArray,?array $filterArray){
        if($filterArray === null) return $sourceArray;
        $returnArray = [];
        foreach($filterArray as $k => $v){
            if(is_numeric($k)){
                if(in_array($v,$sourceArray)){
                    $returnArray[] = $v;
                }
                elseif(array_key_exists($v,$sourceArray)){
                    $returnArray[$v] = $sourceArray[$v];
                }
            }
            elseif(is_string($k)) {
                if(in_array($k,$sourceArray)){
                    $returnArray[] = $k;
                }
                elseif(array_key_exists($k,$sourceArray)){
                    if(is_array($sourceArray[$k]) && is_array($filterArray[$k])){
                        $returnArray[$k] = self::filter($sourceArray[$k],$filterArray[$k]);
                    }
                    else{
                        $returnArray[$k] = $sourceArray[$k];
                    }
                }
            }
        }
        return $returnArray;
    }

    public static function normalizeGroups(array $sourceArray){
        $returnArray = [];
        foreach($sourceArray as $k => $v){
            if(is_numeric($k)){
                $returnArray[$v] = true;
            }
            elseif(is_string($k)) {
                if(is_array($v)){
                    $returnArray[$k] = self::normalizeGroups($v);
                }
                else{
                    $returnArray[$k] = $v;
                }
            }
        }
        return $returnArray;
    }
}