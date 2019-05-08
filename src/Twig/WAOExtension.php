<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 30/12/17
 * Time: 00:29
 */

namespace App\Twig;

use App\Helper\WAOHelper;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;
use Twig\TwigFilter;

/**
 * Twig functions and filters to communicate Web Access Objects metadata, intended for use by front-end code
 * Class WAOExtension
 * @package App\Twig
 */
class WAOExtension extends AbstractExtension
{
    /**
     * @var \App\Helper\WAOHelper
     */
    private $waoHelper;


    public function __construct(WAOHelper $waoHelper)
    {
        $this->waoHelper = $waoHelper;
    }

    public function getFunctions()
    {
        return array(
            new TwigFunction('waoList', array($this->waoHelper, 'getWAOClassNames')),
        );
    }

    public function getFilters()
    {
        return array(
            new TwigFilter('getMapping', array($this, 'getMapping')),
            new TwigFilter('getStructure', array($this, 'getStructure')),
            new TwigFilter('getAbridgedName', array($this->waoHelper, 'getAbridgedName'))
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