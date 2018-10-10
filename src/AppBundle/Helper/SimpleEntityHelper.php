<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/09/18
 * Time: 22:57
 */

namespace AppBundle\Helper;

use AppBundle\Entity\ArticleType;
use AppBundle\Entity\DateType;
use AppBundle\Entity\ResourceType;

class SimpleEntityHelper
{
    /**
     * @var array
     */
    private $simpleEntityClasses;


    /**
     * SimpleEntityHelper constructor.
     */
    public function __construct()
    {
        $this->simpleEntityClasses = array(
            ArticleType::class,
            DateType::class,
            ResourceType::class
        );
    }

    public function getEntityMapping(string $className)
    {
        $dtoReflectionClass = new \ReflectionClass($className);
        $getters = array_filter($dtoReflectionClass->getMethods(\ReflectionMethod::IS_PUBLIC),
            function($item){
                return (preg_match("#^get#",$item->name) == 1) &&
                    !in_array($item->name,["getGroups","getMediator"]);
            });

        $annotations = array_map(function(\ReflectionMethod $item){
            $groups = [];
            $matches = [];
            if(preg_match("#@Groups\({(?<groups>[^}]+)}\)#i",
                    str_replace(" ","",$item->getDocComment()),$matches) == 1){
                $groups = explode(",",str_replace("\"","",$matches["groups"]));
            }

            return ["name"=>lcfirst(substr($item->name,3)),"groups" => $groups];
        },$getters);

        $mapping = array();
        foreach ($annotations as $annotation){
            foreach($annotation["groups"] as $group){
                $mapping[$group] = array_merge(isset($mapping[$group])?$mapping[$group]:[],
                    [$annotation["name"]]);
            }
        }
        return $mapping;
    }

    public function getEntityClassNames(){
        return $this->simpleEntityClasses;
    }
}