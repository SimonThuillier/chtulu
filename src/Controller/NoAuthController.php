<?php

namespace App\Controller;

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
    public function indexAction(Request $request,$page)
    {
        return $this->render('@HB/no-auth.html.twig', []);
    }


}
