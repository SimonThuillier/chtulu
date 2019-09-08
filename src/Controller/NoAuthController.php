<?php

namespace App\Controller;

use App\Util\HJsonResponse;
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
        $hResponse = new HJsonResponse();
        $hResponse
            ->setData(['hbaseVersion'=>$this->getParameter('hbase_version')])
            ->setStatus(HJsonResponse::CONFIRM);
        $hResponse = HJsonResponse::normalize($hResponse);

        if($session->has('initialHResponse')){
            $hResponse = $session->get('initialHResponse',$hResponse);
            $session->remove('initialHResponse');
            $hResponse['data']['hbaseVersion'] = $this->getParameter('hbase_version');
        }
        if(is_array($hResponse)) $hResponse = json_encode($hResponse);

        return $this->render('@HB/no-auth.html.twig', ['page'=>$page,'hResponse'=>$hResponse]);
    }


}
