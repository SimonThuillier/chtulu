<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 30/08/18
 * Time: 18:36
 */

namespace AppBundle\Manager;

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\HttpKernel\KernelInterface;

class ReactTranspiler
{
    private $rootDir;

    public function __construct(KernelInterface $kernel)
    {
        $this->rootDir=$kernel->getRootDir();
    }



    public function test1(){

        $cmd = 'npx babel [ROOT]/web/js/test-react.jsx --out-file [ROOT]/web/js/test-react-compiled.js';

            $cmd = str_replace('[ROOT]',$this->rootDir . '/../', $cmd);


        exec($cmd);
    }
}