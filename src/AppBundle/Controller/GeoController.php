<?php

namespace AppBundle\Controller;

use AppBundle\Manager\ReactTranspiler;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;

/**
 * Class GeoController
 * @package AppBundle\Controller
 * @Route("/geo")
 */
class GeoController extends Controller
{
    /**
     * @Route("/test", name="geo_testpage")
     * @Template()
     */
    public function testAction(Request $request)
    {
        /** @var Session $session */
        $session = $this->get('session');

        return array();
    }

    /**
     * @Route("/react", name="geo_testpage")
     * @Template()
     */
    public function reactAction(Request $request,ReactTranspiler $transpiler)
    {
        /** @var Session $session */
        $session = $this->get('session');

        $cmd = $transpiler->test1();

        return array('cmd'=>$cmd);
    }
}
