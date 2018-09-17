<?php

namespace AppBundle\Controller;

use AppBundle\DTO\ArticleDTO;
use AppBundle\Factory\MediatorFactory;
use AppBundle\Serializer\DTONormalizer;
use AppBundle\Utils\HJsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

/**
 *
 * @author belze
 *         @Route("/crud")
 */
class CRUDController extends Controller
{
    const MEDIATOR_NS = 'AppBundle\\Mediator\\';
    const FORM_NS = 'AppBundle\\Form\\';


    /**
     * @param Request $request
     * @param MediatorFactory $mediatorFactory
     * @param DTONormalizer $normalizer
     * @param JsonEncoder $encoder
     * @Route("/get-new",name="crud_get_new")
     * @Method({"GET"})
     * @throws \Exception
     * @return JsonResponse
     */
    public function getNewAction(Request $request,
                                 MediatorFactory $mediatorFactory,
                                 DTONormalizer $normalizer,
                                 JsonEncoder $encoder){
        $hResponse = new HJsonResponse();
        //sleep(2000);
        try{
            if(! $request->query->has("type")) throw new \Exception("Type parameter is mandatory");
            $mediatorClass = self::MEDIATOR_NS . ucfirst($request->query->get("type")) . 'DTOMediator';
            $mediator = $mediatorFactory->create($mediatorClass);
            $mediator->mapDTOGroups();

            $hResponse
                ->setMessage("OK")
                ->setData($normalizer->normalize($mediator->getDTO()));
        }
        catch(\Exception $e){
            $hResponse->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage());
        }

        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }

    /**
     * @param Request $request
     * @param MediatorFactory $mediatorFactory
     * @param DTONormalizer $normalizer
     * @param JsonEncoder $encoder
     * @Route("/post",name="crud_post")
     * @Method({"GET","POST"})
     * @throws \Exception
     * @return JsonResponse
     */
    public function postAction(Request $request,
                               MediatorFactory $mediatorFactory,
                               DTONormalizer $normalizer,
                               JsonEncoder $encoder){
        if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
            $data = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }


        $request->get("test");
        $hResponse = new HJsonResponse();

        try{
            if(! $request->query->has("type")) throw new \Exception("Type parameter is mandatory");
            /*$mediatorClass = self::MEDIATOR_NS . ucfirst($request->query->get("type")) . 'DTOMediator';
            $mediator = $mediatorFactory->create($mediatorClass);
            $mediator->mapDTOGroups();*/

            $form = $form = $this
                ->get('form.factory')
                ->createBuilder(self::FORM_NS . ucfirst($request->query->get("type")) . 'DTOType',
                    self::FORM_NS . ucfirst($request->query->get("type")) . 'DTOType',[
                    'validation_groups'=>[]])
                ->getForm();

            $form->submit($request->request);
            $errors = $this->get('validator')->validate($mediator->getDTO());
            if (! $form->isValid() || count($errors)>0)
            {
                throw new \Exception("Le formulaire contient des erreurs à corriger avant creation");
            }

            $hResponse
                ->setMessage("OK")
                ->setData(["content"=>$request->getContent(),"comment"=>$request->request->get("comment")]);
        }
        catch(\Exception $e){
            $hResponse->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage());
        }

        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }
}
