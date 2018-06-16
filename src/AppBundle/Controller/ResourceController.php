<?php

namespace AppBundle\Controller;

use AppBundle\Utils\HJsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 *
 * @author belze
 *         @Route("/resource")
 */
class ResourceController extends Controller
{
    /**
     * @Route("/post-upload-image",name="resource_post_upload_image")
     * @Method({"POST"})
     */
    public function postUploadImageAction(Request $request)
    {
        $hResponse = new HJsonResponse();
        $hResponse->setMessage("J'ai bien recu un truc !");
        $hResponse->setStatus(HJsonResponse::SUCCESS);

        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }


}
