<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/09/18
 * Time: 22:57
 */

namespace AppBundle\Helper;


use AppBundle\Factory\DTOFactory;

class DTOHelper
{
    /**
     * @var DTOFactory
     */
    private $DTOFactory;

    /**
     * DTOHelper constructor.
     * @param DTOFactory $DTOFactory
     */
    public function __construct(DTOFactory $DTOFactory)
    {
        $this->DTOFactory = $DTOFactory;
    }

    public function getDTOMapping(string $className)
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

    public function getDTOClassNames(){
        return array_keys($this->DTOFactory::getSubscribedServices());
    }
}