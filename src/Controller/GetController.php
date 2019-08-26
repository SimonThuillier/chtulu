<?php

namespace App\Controller;

use App\DTO\EntityMutableDTO;
use App\Factory\DTOFactory;
use App\Factory\MediatorFactory;
use App\Helper\ListHelper;
use App\Helper\RequestHelper;
use App\Helper\WAOHelper;
use App\Mapper\EntityMapper;
use App\Mediator\DTOMediator;
use App\Serializer\DTONormalizer;
use App\Util\ArrayUtil;
use App\Util\HJsonResponse;
use App\Util\SearchBag;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\EncoderInterface;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 *
 * @author belze
 *         @Route("/_hb_get")
 */
class GetController extends AbstractController
{
    const MEDIATOR_NS = 'App\\Mediator\\';
    const FORM_NS = 'App\\Form\\';

    /**
     * @param Request $request
     * @param WAOHelper $waoHelper
     * @param EntityMapper $mapper
     * @param DTOFactory $dtoFactory
     * @param MediatorFactory $mediatorFactory
     * @param DTONormalizer $normalizer
     * @Route("/get-one-by-id",name="get_get_one_by_id")
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

            $entityClassName = $waoHelper->guessEntityClassName($request->query->get("type"));
            $waoClassName = $waoHelper->guessClassName($request->query->get("type"));

            $entity = $mapper->find($entityClassName,$id);
            $data= null;
            if($waoHelper->isDTO($waoClassName)){
                $mediator = $mediatorFactory->create($waoClassName ,$id,$entity,
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

        $mediatorFactory->finishAndClear();
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
     * @Route("/get",name="get_get")
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

            $entityClassName = $waoHelper->guessEntityClassName($request->query->get("type"));
            $waoClassName = $waoHelper->guessClassName($request->query->get("type"));

            $count = 0;
            $entities = $mapper->searchBy($entityClassName,$searchBag,$count);
            $data= [];
            if($waoHelper->isDTO($waoClassName)){
                $mediator = $mediatorFactory->create($waoClassName ,
                    null,
                    null,
                    null,
                    DTOMediator::NOTHING_IF_NULL);
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
            $mediatorFactory->finishAndClear();
            ob_clean();
            return new JsonResponse(
                ListHelper::getNormalizedListData($data,$normalizer,$groups,$count));
        }
        catch(\Exception $e){
            $hResponse->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage());
        }
        $mediatorFactory->finishAndClear();
        ob_clean();
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }

    /**
     * @param Request $request
     * @param RequestHelper $requestHelper
     * @param WAOHelper $waoHelper
     * @param MediatorFactory $mediatorFactory
     * @param DTONormalizer $normalizer
     * @Route("/get-new",name="get_get_new")
     * @Method({"GET"})
     * @throws \Exception
     * @return JsonResponse
     */
    public function getNewAction(Request $request,
                                 RequestHelper $requestHelper,
                                 WAOHelper $waoHelper,
                                 MediatorFactory $mediatorFactory,
                                 DTONormalizer $normalizer)
    {
        $hResponse = new HJsonResponse();
        try{
            $handledRequest = $requestHelper->handleGetNewRequest($request);
            $dtoClassName = $waoHelper->guessClassName($handledRequest["waoType"]);
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
        $mediatorFactory->finishAndClear();
        ob_clean();
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }
}
