<?php

namespace App\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * the getController must be beyond the firewall so that when a user is connected it receives the good tokenStorage
 * Hence this controller is the one for public get which simply forward the different requests to the getController where logic is
 * @author belze
 * @Route("/_hb_public_get",name="public_get_")
 */
class PublicGetController extends AbstractController
{

    /**
     * @param Request $request
     * @Route("/get-one-by-id",name="get_one_by_id")
     * @Method({"GET"})
     * @throws \Exception
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     * @return JsonResponse
     */
    public function getOneByIdAction(Request $request)
    {
        return $this->forward("App\Controller\GetController:getOneByIdAction",['request'=>$request]);
    }

    /**
     * @param Request $request
     * @Route("/get",name="get")
     * @Method({"GET"})
     * @throws \Exception
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     * @return JsonResponse
     */
    public function getAction(Request $request){
        return $this->forward("App\Controller\GetController:getAction",['request'=>$request]);
    }

    /**
     * @param Request $request
     * @Route("/get-new",name="get_new")
     * @Method({"GET"})
     * @throws \Exception
     * @return JsonResponse
     */
    public function getNewAction(Request $request)
    {
        return $this->forward("App\Controller\GetController:getNewAction",['request'=>$request]);
    }
}
