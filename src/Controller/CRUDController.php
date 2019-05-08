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
use App\Serializer\DTONormalizer;
use App\Utils\ArrayUtil;
use App\Utils\HJsonResponse;
use App\Utils\SearchBag;
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
     * @param EncoderInterface; $encoder
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
                               EncoderInterface $encoder){

        $hResponse = new HJsonResponse();
        $transformedErrors = [];
        $backData = [];
        $actionCount = 0;

        try{
            $handledRequest = $requestHelper->handlePostRequest($request);
            if(false && !$this->isCsrfTokenValid('app_token', $handledRequest["_token"]))
                throw new \Exception("Invalid token : would you hack history ?");
            $hResponse->setSenderKey($handledRequest["senderKey"]);

            foreach($handledRequest["waos"] as $waoType => $waoData){
                $dtoClassName = $waoHelper->guessClassName($waoType);
                $backData[$waoType] = [];

                foreach($waoData as $id=>$data){
                    $entity = null;
                    $id = intval($id);
                    if($id > 0 ) $entity = $mapper->find($dtoClassName,$id);
                    $mediator = $mediatorFactory->create($dtoClassName,$entity);
                    $postedGroups = $data["postedGroups"];
                    $mediator->mapDTOGroups($postedGroups,DTOMediator::NOTHING_IF_NULL);
                    /** @var EntityMutableDTO $dto */
                    $dto=$mediator->getDTO();

                    $objectName = strtoupper($waoType) . 'OF_ID_' . $dto->getId();

                    $dto = $normalizer->denormalize($data,$dtoClassName,null,array("existingDto"=>$dto,"groups"=>$postedGroups));

                    $objectName = method_exists($dto,'getTitle')?$waoType . ' ' . $dto->getTitle():$objectName;
                    $objectName = method_exists($dto,'getName')?$waoType . ' ' . $dto->getName():$objectName;


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
                        $transformedErrors[$objectName]=$objectError;
                        $dto->setBackGroups(['minimal'=>true]);
                        $backData[$waoType][$dto->getId()] = $normalizer->normalize($dto,['minimal'=>true]);
                        continue;
                    }
                    $mapperCommands = $mediator->returnDataToEntity();
                    $newEntities=[];
                    $mapper->executeCommands($mapperCommands,true,$newEntities);

                    // at this step data is well injected to the database, now get the backData
                    // let's begin with the newly created objects
                    /** @var DTOMutableEntity $newEntity */
                    /** @var EntityMutableDTO $newEntityDto */
                    foreach ($newEntities as $newEntity){
                        $newEntityDto = $newEntity->getMediator()->getDTO();
                        $backGroups = $newEntityDto->getReturnGroups();
                        $newEntity->getMediator()->resetChangedProperties()
                            ->mapDTOGroups($backGroups);
                        $newEntityDto->setBackGroups($backGroups);

                        $newEntityWaoType = $waoHelper->getAbridgedName($newEntity->getMediator()->getDtoClassName());
                        if(!array_key_exists($newEntityWaoType,$backData)) $backData[$newEntityWaoType] = [];
                        $backData[$newEntityWaoType][$newEntityDto->getId()] = $normalizer->normalize($newEntityDto,$backGroups);
                    }
                    // then the main core object
                    if($dto->getToDelete()) $postedGroups = ["minimal"=>true];
                    $backGroups = ArrayUtil::normalizeGroups(ArrayUtil::filter($dto->getReturnGroups(),$postedGroups));
                    if(!$dto->getToDelete()) $mediator->mapDTOGroups($backGroups,DTOMediator::NOTHING_IF_NULL);
                    $dto->setBackGroups($backGroups);
                    $backData[$waoType][$dto->getId()] = $normalizer->normalize($dto,$backGroups);
                    $actionCount++;
                }
            }

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
                throw new \Exception($errorMessage);
            }


        $hResponse
            ->setData(json_encode($backData))
            ->setMessage($actionCount===1?"Les données ont été enregistrées"
                :"Toutes vos modifications ont été sauvegardées");
        }
        catch(\Exception $e){
            $hResponse->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage())
                ->setErrors($transformedErrors)
                ->setData(json_encode($backData));
        }
        ob_clean();
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }
}
