<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 30/12/17
 * Time: 00:29
 */

namespace AppBundle\Twig;

use AppBundle\Helper\DTOHelper;
use AppBundle\Helper\SimpleEntityHelper;

/**
 * Twig functions and filters to communicate Web Access Objects metadata, intended for use by front-end code
 * Class WAOExtension
 * @package AppBundle\Twig
 */
class WAOExtension extends \Twig_Extension
{
    /**
     * @var \AppBundle\Helper\DTOHelper
     */
    private $dtoHelper;
    /**
     * @var \AppBundle\Helper\SimpleEntityHelper
     */
    private $simpleEntityHelper;


    public function __construct(
        DTOHelper $dtoHelper,
        SimpleEntityHelper $simpleEntityHelper)
    {
        $this->dtoHelper = $dtoHelper;
        $this->simpleEntityHelper = $simpleEntityHelper;
    }

    public function getFunctions()
    {
        return array(
            new \Twig_Function('waoList', array($this, 'getWAOClassNames')),
        );
    }

    /**
     * returns all Web Access Objects classNames available including DTOs and simple Entities
     * @return array
     */
    public function getWAOClassNames(){
        return array_merge($this->dtoHelper->getDTOClassNames(),$this->simpleEntityHelper->getEntityClassNames());
    }


    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('getMapping', array($this, 'getMapping')),
            new \Twig_SimpleFilter('getStructure', array($this, 'getStructure')),
            new \Twig_SimpleFilter('getAbridgedName', array($this->dtoHelper, 'getAbridgedName'))
        );
    }

    public function getMapping($className){
        if(in_array($className,$this->simpleEntityHelper->getEntityClassNames()))
            return json_encode($this->simpleEntityHelper->getEntityMapping($className));
        else return json_encode($this->dtoHelper->getDTOMapping($className));
    }

    public function getStructure($className){
        $dtoStructure = $this->dtoHelper->getDTOStructure($className);
        $dtoStructure = array_map(function(array $item){

            return [$item["name"] => $this->dtoHelper->getAbridgedName($item["returnType"])];
        },$dtoStructure);
        return json_encode($dtoStructure);
    }
}