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
    const DTO_NS = 'AppBundle\\DTO\\';
    const ENTITY_NS = 'AppBundle\\Entity\\';


    /**
     * @var DTOFactory
     */
    private $DTOFactory;
    /**
     * @var SimpleEntityHelper
     */
    private $simpleEntityHelper;

    /**
     * DTOHelper constructor.
     * @param DTOFactory $DTOFactory
     * @param SimpleEntityHelper $simpleEntityHelper
     */
    public function __construct(DTOFactory $DTOFactory,
                                SimpleEntityHelper $simpleEntityHelper)
    {
        $this->DTOFactory = $DTOFactory;
        $this->simpleEntityHelper = $simpleEntityHelper;
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

    public function getDTOStructure(string $className)
    {
        $dtoReflectionClass = new \ReflectionClass($className);
        $getters = array_filter($dtoReflectionClass->getMethods(\ReflectionMethod::IS_PUBLIC),
            function($item){
                return (preg_match("#^get#",$item->name) == 1) &&
                    !in_array($item->name,["getGroups","getMediator"]);
            });

        $waoClassNames = array_merge($this->getDTOClassNames(),$this->simpleEntityHelper->getEntityClassNames());

        $structure = [];

        /**
         * @var \ReflectionMethod $item
         */
        foreach($getters as $item){
            $returnType = $item->getReturnType();
            if($returnType){$returnType =  $returnType->getName();}
            elseif(preg_match("#@return[ ]+(?<returnType>[\w]+)#i",$item->getDocComment(),$matches) == 1){
                    $returnType = $matches["returnType"];
            }
            else{continue;}
            if(! ctype_upper($returnType{0})) continue;

            $returnType = str_replace("[]","",$returnType); // handle arrays

            if(! strpos($returnType,"\\")){
                if(strpos($returnType,"DTO") !== false) $returnType =  self::DTO_NS . $returnType;
                else $returnType = self::ENTITY_NS . $returnType;
            }
            if(in_array($returnType,$waoClassNames)){
                $structure[] = ["name"=>lcfirst(substr($item->name,3)),"returnType" => $returnType];
            }
        }

        return $structure;
    }

    public function getAbridgedName($className){
        if(in_array($className,$this->simpleEntityHelper->getEntityClassNames())){
            $matches=[];
            preg_match("#\\\\(?<name>[^\\\\]+)$#",$className,$matches);
            return lcfirst($matches["name"]);
        }
        else
        {
            $matches=[];
            preg_match("#\\\\(?<name>[^\\\\]+)DTO$#",$className,$matches);
            return lcfirst($matches["name"]);
        }
    }



    public function getDTOClassNames(){
        return array_keys($this->DTOFactory::getSubscribedServices());
    }
}