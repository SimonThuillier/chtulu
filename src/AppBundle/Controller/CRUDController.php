<?php

namespace AppBundle\Controller;

use AppBundle\DTO\EntityMutableDTO;
use AppBundle\Factory\DTOFactory;
use AppBundle\Factory\MediatorFactory;
use AppBundle\Helper\ListHelper;
use AppBundle\Helper\WAOHelper;
use AppBundle\Mapper\EntityMapper;
use AppBundle\Mediator\DTOMediator;
use AppBundle\Serializer\DTONormalizer;
use AppBundle\Utils\ArrayUtil;
use AppBundle\Utils\HJsonResponse;
use AppBundle\Utils\SearchBag;
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
    const MEDIATOR_NS = 'AppBundle\\Mediator\\';
    const FORM_NS = 'AppBundle\\Form\\';

    /**
     * @param Request $request
     * @param WAOHelper $waoHelper
     * @param EntityMapper $mapper
     * @param DTOFactory $dtoFactory
     * @param MediatorFactory $mediatorFactory
     * @param DTONormalizer $normalizer
     * @Route("/get-one-by-id",name="crud_get_one_by_id")
     * @Method({"GET"})
     * @throws \Exception
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     * @return JsonResponse
     */
    public function getOneByIdAction(Request $request,
                                     WAOHelper $waoHelper,
                                     EntityMapper $mapper,
                                     DTOFactory $dtoFactory,
                                     MediatorFactory $mediatorFactory,
                                     DTONormalizer $normalizer)
    {
        $hResponse = new HJsonResponse();
        try{
            if(! $request->query->has("type")) throw new \Exception("Type parameter is mandatory");
            if(! $request->query->has("groups")) throw new \Exception("Groups parameter is mandatory");
            if(! $request->query->has("id")) throw new \Exception("Id parameter is mandatory");
            $groups = json_decode($request->query->get("groups"),true);
            $id = intval($request->query->get("id"));
            $waoClassName = $waoHelper->guessClassName($request->query->get("type"));

            $entity = $mapper->find($waoClassName,$id);
            $data= null;
            if($waoHelper->isDTO($waoClassName)){
                $mediator = $mediatorFactory->create($waoClassName ,$entity,
                    $dtoFactory->create($waoClassName),DTOMediator::NOTHING_IF_NULL);
                /** @var EntityMutableDTO $dto */
                $dto =  $mediator->mapDTOGroups($groups)->getDTO();
                $data = $normalizer->normalize($dto,$dto->getLoadedGroups());
            }
            else{
                $data = $normalizer->normalize($entity,$groups);
                $data["loadedGroups"] = $groups;
            }

            $hResponse->setMessage("OK")->setData($data);

            ob_clean();
            return new JsonResponse(HJsonResponse::normalize($hResponse));
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
     * @param WAOHelper $waoHelper
     * @param EntityMapper $mapper
     * @param DTOFactory $dtoFactory
     * @param MediatorFactory $mediatorFactory
     * @param DTONormalizer $normalizer
     * @Route("/get",name="crud_get")
     * @Method({"GET"})
     * @throws \Exception
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     * @return JsonResponse
     */
    public function getAction(Request $request,
                              WAOHelper $waoHelper,
                              EntityMapper $mapper,
                              DTOFactory $dtoFactory,
                              MediatorFactory $mediatorFactory,
                              DTONormalizer $normalizer){
        $hResponse = new HJsonResponse();

        try{
            if(! $request->query->has("type")) throw new \Exception("Type parameter is mandatory");
            if(! $request->query->has("groups")) throw new \Exception("Groups parameter is mandatory");
            if(! $request->query->has("searchBag")) throw new \Exception("SearchBag parameter is mandatory");
            $groups = json_decode($request->query->get("groups"),true);
            $searchBag = SearchBag::createFromArray(
                json_decode($request->query->get("searchBag"),true));

            $waoClassName = $waoHelper->guessClassName($request->query->get("type"));

            $count = 0;
            $entities = $mapper->searchBy($waoClassName,$searchBag,$count);
            $data= [];
            if($waoHelper->isDTO($waoClassName)){
                $mediator = $mediatorFactory->create($waoClassName ,null,null,DTOMediator::NOTHING_IF_NULL);
                foreach($entities as $entity){
                    $data[] =  $mediator
                        ->setEntity($entity)
                        ->setDTO($dtoFactory->create($waoClassName))
                        ->mapDTOGroups($groups)
                        ->getDTO();
                }
            }
            else{
                $data = $entities;
            }

            ob_clean();
            $truc =
                ListHelper::getNormalizedListData($data,$normalizer,$groups,$count);
            return new JsonResponse(
                ListHelper::getNormalizedListData($data,$normalizer,$groups,$count));
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
     * @param WAOHelper $waoHelper
     * @param MediatorFactory $mediatorFactory
     * @param DTONormalizer $normalizer
     * @Route("/get-new",name="crud_get_new")
     * @Method({"GET"})
     * @throws \Exception
     * @return JsonResponse
     */
    public function getNewAction(Request $request,
                                 WAOHelper $waoHelper,
                                 MediatorFactory $mediatorFactory,
                                 DTONormalizer $normalizer)
    {
        $hResponse = new HJsonResponse();
        //sleep(2000);
        try{
            if(! $request->query->has("type")) throw new \Exception("Type parameter is mandatory");
            $dtoClassName = $waoHelper->guessClassName($request->query->get("type"));
            if(! $waoHelper->isDTO($dtoClassName))
                throw new \Exception($request->query->has("type") . " is not a known DTO");
            $mediator = $mediatorFactory->create($dtoClassName);
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
     * @param WAOHelper $waoHelper
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
                               WAOHelper $waoHelper,
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

        try{
        if(! $request->query->has("type")) throw new \Exception("Type parameter is mandatory");

        $dtoClassName = $waoHelper->guessClassName($request->query->get("type"));
        if(! $waoHelper->isDTO($dtoClassName))
            throw new \Exception($request->query->has("type") . " is not a known DTO");

        $entity = null;
        $id = intval($request->query->get("id"));
        if($id > 1 ) $entity = $mapper->find($dtoClassName,$id);

        $mediator = $mediatorFactory->create($dtoClassName,$entity);
        $postedGroups = $data["postedGroups"];

        $form = $formFactory->createBuilder($waoHelper->getFormClassName($dtoClassName),$mediator->getDTO(),[
            'validation_groups'=>$postedGroups])
            ->getForm();

        $form->submit($data);
        /** @var EntityMutableDTO $dto */
        $dto=$mediator->getDTO();
        $errors = $validator->validate($dto,null,$postedGroups);
        if (! $form->isValid() || count($errors)>0)
        {
            throw new \Exception("Le formulaire contient des erreurs à corriger avant creation");
        }
        $mapper->addOrEdit($dto);
        $returnGroups = ArrayUtil::filter($dto->getReturnGroups(),$postedGroups);
        $mediator->mapDTOGroups($returnGroups,DTOMediator::NOTHING_IF_NULL);

        $hResponse
            ->setData($normalizer->normalize($dto,$returnGroups))
            ->setMessage("Données enregistrées");
        }
        catch(\Exception $e){
            $hResponse->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage());
        }
        ob_clean();
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }
}