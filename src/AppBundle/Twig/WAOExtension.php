<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 30/12/17
 * Time: 00:29
 */

namespace AppBundle\Twig;

use AppBundle\Helper\WAOHelper;

/**
 * Twig functions and filters to communicate Web Access Objects metadata, intended for use by front-end code
 * Class WAOExtension
 * @package AppBundle\Twig
 */
class WAOExtension extends \Twig_Extension
{
    /**
     * @var \AppBundle\Helper\WAOHelper
     */
    private $waoHelper;


    public function __construct(WAOHelper $waoHelper)
    {
        $this->waoHelper = $waoHelper;
    }

    public function getFunctions()
    {
        return array(
            new \Twig_Function('waoList', array($this->waoHelper, 'getWAOClassNames')),
        );
    }

    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('getMapping', array($this, 'getMapping')),
            new \Twig_SimpleFilter('getStructure', array($this, 'getStructure')),
            new \Twig_SimpleFilter('getAbridgedName', array($this->waoHelper, 'getAbridgedName'))
        );
    }

    public function getMapping($className){
        if($this->waoHelper->isSimpleEntity($className))
            return json_encode($this->waoHelper->getEntityMapping($className));
        elseif($this->waoHelper->isDTO($className))
            return json_encode($this->waoHelper->getDTOMapping($className));
        else return null;
    }

    public function getStructure($className){
        $dtoStructure = $this->waoHelper->getDTOStructure($className);
        foreach($dtoStructure as $name => $returnType){
            $dtoStructure[$name] = $this->waoHelper->getAbridgedName($returnType);
        }

        return json_encode($dtoStructure);
    }
}