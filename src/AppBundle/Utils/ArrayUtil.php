<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 26/06/18
 * Time: 21:42
 */

namespace AppBundle\Utils;


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
}