<?php

namespace AppBundle\Controller;

use AppBundle\DTO\ArticleDTO;
use AppBundle\Factory\MediatorFactory;
use AppBundle\Mapper\EntityMapper;
use AppBundle\Serializer\DTONormalizer;
use AppBundle\Utils\HJsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Validator\Validator\TraceableValidator;

/**
 *
 * @author belze
 *         @Route("/crud")
 */
class CRUDController extends Controller
{
    const ENTITY_NS = 'AppBundle\\Entity\\';
    const DTO_NS = 'AppBundle\\DTO\\';
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
        ob_clean();
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }

    /**
     * @param Request $request
     * @param TraceableValidator $validator
     * @param FormFactory $formFactory
     * @param EntityMapper $mapper
     * @param MediatorFactory $mediatorFactory
     * @param DTONormalizer $normalizer
     * @param JsonEncoder $encoder
     * @Route("/post",name="crud_post")
     * @Method({"GET","POST"})
     * @throws \Exception
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     * @return JsonResponse
     */
    public function postAction(Request $request,
                               TraceableValidator $validator,
                               FormFactory $formFactory,
                               EntityMapper $mapper,
                               MediatorFactory $mediatorFactory,
                               DTONormalizer $normalizer,
                               JsonEncoder $encoder){

        if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
            $data = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }
        else die;
        $request->get("test");
        $hResponse = new HJsonResponse();
//
//        try{
            if(! $request->query->has("type")) throw new \Exception("Type parameter is mandatory");
            $type = ucfirst($request->query->get("type"));
            $dtoClassName = self::DTO_NS . $type . 'DTO';
            $mediatorClassName = self::MEDIATOR_NS . $type . 'DTOMediator';
            $formClassName = self::FORM_NS . $type . 'DTOType';

            $entity = null;
            $id = intval($request->query->get("id"));
            if($id > 1 ) $entity = $mapper->find($dtoClassName,$id);

            $mediator = $mediatorFactory->create($mediatorClassName,$entity);

            $form = $formFactory->createBuilder($formClassName,$mediator->getDTO(),[
                    'validation_groups'=>[]])
                ->getForm();

            $form->submit($data);
            $dto=$mediator->getDTO();
            $errors = $validator->validate($dto);
            if (! $form->isValid() || count($errors)>0)
            {
                $la = $form->getErrors(true,false);
                $lo = $this->isCsrfTokenValid('token_id',$data["_token"]);
                throw new \Exception("Le formulaire contient des erreurs à corriger avant creation");
            }
            $mapper->addOrEdit($dto);

            $hResponse
                ->setMessage("Données enregistrées");
//        }
//        catch(\Exception $e){
//            $hResponse->setStatus(HJsonResponse::ERROR)
//                ->setMessage($e->getMessage());
//        }
        ob_clean();
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }
}
