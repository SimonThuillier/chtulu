<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Route("/web", name="no-auth_")
 */
class NoAuthController extends AbstractController
{

    /**
     * main controller for loading the spa
     * TODO : check for auth and no-auth redirecting
     * @Route("/{page}", name="homepage",requirements={"page"=".+"})
     * @throws \Exception
     */
    public function indexAction(Request $request,Session $session,$page)
    {
        $hResponse = null;
        if($session->has('initialHResponse')){
            $hResponse = $session->get('initialHResponse',$hResponse);
            $session->remove('initialHResponse');
            if(is_array($hResponse)) $hResponse = json_encode($hResponse);
        }

        return $this->render('@HB/no-auth.html.twig', ['page'=>$page,'hResponse'=>$hResponse]);
    }


}
