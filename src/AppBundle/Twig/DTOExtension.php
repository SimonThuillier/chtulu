<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 30/12/17
 * Time: 00:29
 */

namespace AppBundle\Twig;

use AppBundle\Helper\DTOHelper;

class DTOExtension extends \Twig_Extension
{
    /**
     * @var \AppBundle\Helper\DTOHelper
     */
    private $dtoHelper;


    public function __construct(DTOHelper $dtoHelper)
    {
        $this->dtoHelper = $dtoHelper;
    }

    public function getFunctions()
    {
        return array(
            new \Twig_Function('dtoList', array($this->dtoHelper, 'getDTOClassNames'))
        );
    }


    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('getMapping', array($this, 'getMapping')),
            new \Twig_SimpleFilter('getAbridgedName', array($this, 'getAbridgedName'))
        );
    }

    public function getMapping($className){
        return json_encode($this->dtoHelper->getDTOMapping($className));
    }

    public function getAbridgedName($className){
        $matches=[];
        preg_match("#\\\\(?<name>[^\\\\]+)DTO$#",$className,$matches);
        return lcfirst($matches["name"]);
    }


    public function getName()
    {
        return 'dto';
    }
}