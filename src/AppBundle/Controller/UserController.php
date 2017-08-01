<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class UserController extends Controller
{
    /**
     * @Route("/login",name="login")
     */
    public function loginAction()
    {
        $test = $this->get('validator');
        
        return $this->render('AppBundle:Controller:login.html.twig', array(
            // ...
        ));
    }

}
