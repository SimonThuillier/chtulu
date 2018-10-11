<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 08/04/18
 * Time: 16:51
 */

namespace AppBundle\Helper;


use AppBundle\Serializer\HNormalizer;
use AppBundle\Utils\HJsonResponse;

class ListHelper
{
    /**
     * @param array $objects
     * @param HNormalizer $serializer
     * @param array $groups
     * @param int $count
     * @return array
     */
    public static function getNormalizedListData($objects,$serializer,$groups,$count=null)
    {
        $data = ["status"=>HJsonResponse::SUCCESS,"total"=>0,"rows"=>[]];
        if($objects == null || count($objects) === 0) return $data;

        foreach($objects as $object){
            $normalization = $serializer->normalize($object,$groups);
            if(!array_key_exists("loadedGroups",$normalization)){
                $normalization["loadedGroups"] = $groups;
            }
            $data["rows"][] = $normalization;
        }
        if($count === null ) $count = count($objects);
        $data["total"] = $count;
        return $data;
    }
}