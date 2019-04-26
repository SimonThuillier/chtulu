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
use AppBundle\Factory\DTOFactory;

class WAOHelper
{
    const DTO_NS = 'AppBundle\\DTO\\';
    const ENTITY_NS = 'AppBundle\\Entity\\';
    const FORM_NS = 'AppBundle\\Form\\';

    /**
     * @var DTOFactory
     */
    private $DTOFactory;
    /**
     * @var array
     */
    private $simpleEntityClasses;

    /**
     * WAOHelper constructor.
     * @param DTOFactory $DTOFactory
     */
    public function __construct(DTOFactory $DTOFactory)
    {
        $this->DTOFactory = $DTOFactory;
        $this->simpleEntityClasses = array(
            ArticleType::class,
            DateType::class,
            ResourceType::class
        );
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

    public function getDTOStructure(string $className,bool $onlyDto=true)
    {
        $dtoReflectionClass = new \ReflectionClass($className);
        $getters = array_filter($dtoReflectionClass->getMethods(\ReflectionMethod::IS_PUBLIC),
            function($item){
                return (preg_match("#^get#",$item->name) == 1) &&
                    !in_array($item->name,["getGroups","getMediator"]);
            });

        $waoClassNames = array_merge($this->getDTOClassNames(),$this->getSimpleEntityClassNames());

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
            if(!$onlyDto || in_array($returnType,$waoClassNames)){
                $structure[] = ["name"=>lcfirst(substr($item->name,3)),"returnType" => $returnType];
            }
        }

        $simpleStructure= [];
        foreach($structure as $item){
            $simpleStructure[$item["name"]] = $item["returnType"];
        }

        return $simpleStructure;
    }

    public function getAbridgedName($className){
        if(in_array($className,$this->getSimpleEntityClassNames())){
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

    public function guessClassName($abridgedClassName){
        $className = self::ENTITY_NS . ucfirst($abridgedClassName);
        if(in_array($className,$this->simpleEntityClasses)) return $className;
        else return self::DTO_NS . ucfirst($abridgedClassName) . "DTO";
    }

    public function isSimpleEntity($className){
        if(in_array($className,$this->simpleEntityClasses)) return true;
        else return false;
    }

    public function isDTO($className){
        if(in_array($className,array_keys($this->DTOFactory::getSubscribedServices()))) return true;
        else return false;
    }

    public function getFormClassName($dtoClassName){
        return str_replace(self::DTO_NS,self::FORM_NS,$dtoClassName) . "Type";
    }

    public function getDTOClassNames(){
        return array_keys($this->DTOFactory::getSubscribedServices());
    }

    public function getSimpleEntityClassNames(){
        return $this->simpleEntityClasses;
    }

    public function getWAOClassNames(){
        return array_merge($this->getDTOClassNames(),$this->getSimpleEntityClassNames());
    }

}