<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 13/06/18
 * Time: 22:49
 */

namespace App\Helper;


use Symfony\Component\DependencyInjection\ContainerInterface;

class AssetHelper
{
    /** @var ContainerInterface */
    private $locator;

    /**
     * AssetHelper constructor.
     * @param ContainerInterface $locator
     */
    public function __construct(ContainerInterface $locator)
    {
        $this->locator = $locator;
    }


    public function getdefaultImage($entity,$filter=null){
        return "/images/default-image.jpeg";
    }
}