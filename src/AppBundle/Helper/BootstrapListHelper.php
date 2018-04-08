<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 08/04/18
 * Time: 16:51
 */

namespace AppBundle\Helper;


use AppBundle\Serializer\HSerializer;
use AppBundle\Serializer\SerializationException;

class BootstrapListHelper
{
    /**
     * @param array $objects
     * @param HSerializer $serializer
     * @param array $groups
     * @return array
     * @throws SerializationException
     */
    public static function getNormalizedListData($objects,$serializer,$groups)
    {
        $data = ["total"=>0,"rows"=>[]];
        if($objects == null || count($objects) === 0) return $data;

        foreach($objects as $object){
            $data["rows"][] = $serializer->normalize($object,$groups);
        }
        $data["total"] = count($objects);
        return $data;
    }

    /**
     * @param array $objects
     * @param HSerializer $serializer
     * @param array $groups
     * @return string
     * @throws SerializationException
     */
    public static function getSerializedListData($objects,$serializer,$groups)
    {
        return $serializer->encode(self::getNormalizedListData($objects,$serializer,$groups));
    }




}