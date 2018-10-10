<?php

namespace AppBundle\Controller;

use AppBundle\DTO\ArticleDTO;
use AppBundle\DTO\EntityMutableDTO;
use AppBundle\Factory\DTOFactory;
use AppBundle\Factory\MediatorFactory;
use AppBundle\Helper\ListHelper;
use AppBundle\Mapper\EntityMapper;
use AppBundle\Mediator\DTOMediator;
use AppBundle\Serializer\ArticleDTONormalizer;
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
    const ENTITY_NS = 'AppBundle\\Entity\\';
    const DTO_NS = 'AppBundle\\DTO\\';
    const MEDIATOR_NS = 'AppBundle\\Mediator\\';
    const FORM_NS = 'AppBundle\\Form\\';

    /**
     * @param string $type
     * @return string
     */
    private static function getDtoClassName(string $type){
        return self::DTO_NS . ucfirst($type) . "DTO";
    }

    /**
     * @param string $type
     * @return string
     */
    private static function getFormClassName(string $type){
        return self::FORM_NS . ucfirst($type) . "DTOType";
    }


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
            $dtoClassName = self::getDtoClassName($request->query->get("type"));
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
     * @param EntityMapper $mapper
     * @param DTOFactory $dtoFactory
     * @param MediatorFactory $mediatorFactory
     * @param DTONormalizer $normalizer
     * @Route("/get-one-by-id",name="crud_get_one_by_id")
     * @Method({"GET","POST"})
     * @throws \Exception
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     * @return JsonResponse
     */
    public function getOneByIdAction(Request $request,
                              EntityMapper $mapper,
                              DTOFactory $dtoFactory,
                              MediatorFactory $mediatorFactory,
                              DTONormalizer $normalizer){
        $hResponse = new HJsonResponse();

        try{
            if(! $request->query->has("type")) throw new \Exception("Type parameter is mandatory");
            if(! $request->query->has("groups")) throw new \Exception("Groups parameter is mandatory");
            if(! $request->query->has("id")) throw new \Exception("Id parameter is mandatory");
            $type = ucfirst($request->query->get("type"));
            $groups = json_decode($request->query->get("groups"),true);
            $id = intval($request->query->get("id"));
            $dtoClassName = self::getDtoClassName($type);

            $entity = $mapper->find($dtoClassName,$id);

            $mediator = $mediatorFactory->create($dtoClassName ,$entity,$dtoFactory->create($dtoClassName),DTOMediator::NOTHING_IF_NULL);
            /** @var EntityMutableDTO $dto */
            $dto =  $mediator->mapDTOGroups($groups)->getDTO();

            $hResponse->setMessage("OK")->setData($normalizer->normalize($dto,$dto->getLoadedGroups()));

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
     * @param EntityMapper $mapper
     * @param DTOFactory $dtoFactory
     * @param MediatorFactory $mediatorFactory
     * @param DTONormalizer $normalizer
     * @Route("/get",name="crud_get")
     * @Method({"GET","POST"})
     * @throws \Exception
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     * @return JsonResponse
     */
    public function getAction(Request $request,
                               EntityMapper $mapper,
                               DTOFactory $dtoFactory,
                               MediatorFactory $mediatorFactory,
                               DTONormalizer $normalizer){
        $hResponse = new HJsonResponse();

        try{
            if(! $request->query->has("type")) throw new \Exception("Type parameter is mandatory");
            if(! $request->query->has("groups")) throw new \Exception("Groups parameter is mandatory");
            if(! $request->query->has("searchBag")) throw new \Exception("SearchBag parameter is mandatory");
            $type = ucfirst($request->query->get("type"));
            $groups = json_decode($request->query->get("groups"),true);
            $searchBag = SearchBag::createFromArray(
                json_decode($request->query->get("searchBag"),true));

            $dtoClassName = self::getDtoClassName($type);
            $count = 0;

            $entities = $mapper->searchBy($dtoClassName,$searchBag,$count);
            $dtos = [];

            $mediator = $mediatorFactory->create($dtoClassName ,null,null,DTOMediator::NOTHING_IF_NULL);
            foreach($entities as $entity){
                $dtos[] =  $mediator
                    ->setEntity($entity)
                    ->setDTO($dtoFactory->create($dtoClassName))
                    ->mapDTOGroups($groups)
                    ->getDTO();
            }

            // $groups = array_merge($groups,['groups','type']);
            ob_clean();
            $truc =
                ListHelper::getNormalizedListData($dtos,$normalizer,$groups,$count);
            return new JsonResponse(
                ListHelper::getNormalizedListData($dtos,$normalizer,$groups,$count));
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
            $dtoClassName = self::getDtoClassName($type);
            $formClassName = self::getFormClassName($type);

            $entity = null;
            $id = intval($request->query->get("id"));
            if($id > 1 ) $entity = $mapper->find($dtoClassName,$id);

            $mediator = $mediatorFactory->create($dtoClassName,$entity);
            $postedGroups = $data["postedGroups"];

            $form = $formFactory->createBuilder($formClassName,$mediator->getDTO(),[
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
//        }
//        catch(\Exception $e){
//            $hResponse->setStatus(HJsonResponse::ERROR)
//                ->setMessage($e->getMessage());
//        }
        ob_clean();
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }
}
