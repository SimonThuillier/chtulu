<?php

namespace App\Controller;

use App\DTO\ArticleDTO;
use App\DTO\EntityMutableDTO;
use App\Entity\DTOMutableEntity;
use App\Factory\DTOFactory;
use App\Factory\MediatorFactory;
use App\Helper\ListHelper;
use App\Helper\RequestHelper;
use App\Helper\WAOHelper;
use App\Mapper\EntityMapper;
use App\Mediator\DTOMediator;
use App\Observer\DBActionObserver;
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
 *         @Route("/crud")
 */
class CRUDController extends AbstractController
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
     * @Route("/get-new",name="crud_get_new")
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

    /**
     * @param Request $request
     * @param RequestHelper $requestHelper
     * @param WAOHelper $waoHelper
     * @param ValidatorInterface $validator
     * @param EntityMapper $mapper
     * @param MediatorFactory $mediatorFactory
     * @param DTONormalizer $normalizer
     * @param DBActionObserver $dbActionObserver
     * @Route("/post",name="crud_post")
     * @Method({"GET","POST"})
     * @throws \Exception
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     * @return JsonResponse
     */
    public function postAction(Request $request,
                               RequestHelper $requestHelper,
                               WAOHelper $waoHelper,
                               ValidatorInterface $validator,
                               EntityMapper $mapper,
                               MediatorFactory $mediatorFactory,
                               DTONormalizer $normalizer,
                               DBActionObserver $dbActionObserver){

        $hResponse = new HJsonResponse();
        $transformedErrors = [];
        $backData = [];
        $actionCount = 0;

        try{
            /** A : Handle the request */
            $handledRequest = $requestHelper->handlePostRequest($request);
            if(false && !$this->isCsrfTokenValid('app_token', $handledRequest["_token"]))
                throw new \Exception("Invalid token : would you hack history ?");
            $hResponse->setSenderKey($handledRequest["senderKey"]);

            /** B : unserialize data to DTOs,validate and return data to entities
             * Hence the DBActionObserver register all requested action (but without executing them yet)
             */
            foreach($handledRequest["waos"] as $waoType => $waoData){
                $entityClassName = $waoHelper->guessEntityClassName($request->query->get("type"));
                $dtoClassName = $waoHelper->guessClassName($waoType);
                $backData[$waoType] = [];

                foreach($waoData as $id=>$data){
                    /** 1 : create the mediator and map the postedGroups */
                    $entity = null;
                    $id = intval($id);
                    if($id > 0 ) $entity = $mapper->find($entityClassName,$id);
                    $mediator = $mediatorFactory->create($dtoClassName,$id,$entity);
                    $postedGroups = $data["postedGroups"];
                    $mediator->mapDTOGroups($postedGroups,DTOMediator::NOTHING_IF_NULL);
                    /** @var EntityMutableDTO $dto */
                    $dto=$mediator->getDTO();

                    /** 2 : denormalize the data to the mediator's DTO */
                    $dto = $normalizer->denormalize($data,$dtoClassName,null,array("existingDto"=>$dto,"groups"=>$postedGroups));

                    /** 3 : validate the DTO */
                    /** @var array $errors */
                    $errors = $validator->validate($dto,null,array_keys($postedGroups));
                    $dto->setErrors([]);
                    if (count($errors)>0)
                    {
                        $objectError = [];
                        /** @var ConstraintViolation $error */
                        foreach($errors as $error){
                            $objectError[$error->getPropertyPath()] = $error->getMessage();
                        }
                        $dto->setErrors($objectError);
                        $transformedErrors[$waoHelper->getOneDtoNaturalName($waoType,$dto)]=$objectError;
                        $dto->reinitializeBackGroups();
                        $backData[$waoType][$dto->getId()] = $normalizer->normalize($dto,$dto->getBackGroups());
                        continue;
                    }

                    /** 4 : return the edited data to entity */
                    $mediator->returnDataToEntity();
                    $actionCount++;
                }
            }

            /** C : get and execute the sequence of actions, e.g. commit changes to database now ! */
            $sequenceOfActions = $dbActionObserver->getSequenceOfActions();
            $mapper->executeSequence($sequenceOfActions);

            /** D : map and normalize the data and errors to return to the client page */
            $modifiedEntities = $dbActionObserver->getModifiedEntities();
            foreach($modifiedEntities as $key=>$entity){
                /** @var DTOMutableEntity $entity */
                if($entity->getMediator() !== null){$mediator = $entity->getMediator();}
                else{
                    $mediator = $mediatorFactory->createWithEntityClassName(
                        get_class($entity),$entity->getId(),$entity);
                }
                $dto = $mediator->getDTO();
                $mediator->mapDTOGroups($dto->getBackGroups(),DTOMediator::NOTHING_IF_NULL);
                $waoType = $waoHelper->getAbridgedName(get_class($dto));
                $backData[$waoType][$dto->getId()] = $normalizer->normalize($dto,$dto->getBackGroups());
            }
            $hResponse->setData(json_encode($backData));
            $fullMemoryUsage = memory_get_usage();

            /** E : handle final response status (are there some errors ?) */
            if(count($transformedErrors)>0){
                $errorMessage = "Les données que vous voulez sauvegarder contiennent des erreurs";
                if($actionCount>1){
                    $errorMessage .= " : \n";
                    foreach($transformedErrors as $objectName => $objectErrors){
                        $errorMessage .= ("--" . $objectName . " : \n");
                        foreach($objectErrors as $property=>$propertyError){
                            $errorMessage .= ("*" . $propertyError . " : \n");
                        }
                    }
                }
                $hResponse
                    ->setStatus(HJsonResponse::ERROR)
                    ->setMessage($errorMessage);
            }
            else{
                $hResponse->setMessage($actionCount===1?"Les données ont été enregistrées"
                    :"Toutes vos modifications ont été sauvegardées");
            }
        }
        catch(\Exception $e){
            $hResponse->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage())
                ->setErrors($transformedErrors)
                ->setData(json_encode($backData));
        }
        $mediatorFactory->finishAndClear();
        $dbActionObserver->finishAndClear();
        ob_clean();
        $lowMemoryUsage = memory_get_usage();
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }
}
