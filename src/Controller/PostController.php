<?php

namespace App\Controller;

use App\DTO\EntityMutableDTO;
use App\DTO\ResourceDTO;
use App\DTO\ResourceVersionDTO;
use App\Entity\DTOMutableEntity;
use App\Entity\ResourceType;
use App\Factory\MediatorFactory;
use App\Helper\RequestHelper;
use App\Helper\WAOHelper;
use App\Mapper\EntityMapper;
use App\Mediator\DTOMediator;
use App\Observer\DBActionObserver;
use App\Serializer\DTONormalizer;
use App\Util\HJsonResponse;
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
 *         @Route("/_hb_post")
 */
class PostController extends AbstractController
{
    const MEDIATOR_NS = 'App\\Mediator\\';
    const FORM_NS = 'App\\Form\\';

    /**
     * @param Request $request
     * @param RequestHelper $requestHelper
     * @param WAOHelper $waoHelper
     * @param ValidatorInterface $validator
     * @param EntityMapper $mapper
     * @param MediatorFactory $mediatorFactory
     * @param DTONormalizer $normalizer
     * @param DBActionObserver $dbActionObserver
     * @Route("/post",name="post_post")
     * @Method({"POST"})
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
                $entityClassName = $waoHelper->guessEntityClassName($waoType);
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
                        EntityMapper::getEntityClassNameFromObject($entity),$entity->getId(),$entity);
                }
                $dto = $mediator->getDTO();
                if($dto->getToDelete()===false){
                    $mediator->mapDTOGroups($dto->getBackGroups(),DTOMediator::NOTHING_IF_NULL);
                }
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


    /**
     * @param Request $request
     * @param RequestHelper $requestHelper
     * @param WAOHelper $waoHelper
     * @param ValidatorInterface $validator
     * @param EntityMapper $mapper
     * @param MediatorFactory $mediatorFactory
     * @param DTONormalizer $normalizer
     * @param DBActionObserver $dbActionObserver
     * @Route("/upload-resource",name="post_upload_resource")
     * @Method({"POST"})
     * @throws \Exception
     * @return JsonResponse
     */
    public function uploadResourceAction(Request $request,
                                         RequestHelper $requestHelper,
                                         WAOHelper $waoHelper,
                                         ValidatorInterface $validator,
                                         EntityMapper $mapper,
                                         MediatorFactory $mediatorFactory,
                                         DTONormalizer $normalizer,
                                         DBActionObserver $dbActionObserver)
    {
        $hResponse = new HJsonResponse();

        try{
            $handledRequest = $requestHelper->handleUploadRequest($request);
            /*if(!$this->isCsrfTokenValid('token_id', $handledRequest["_token"]))
                throw new \Exception("Invalid token : would you hack history ?");*/

            $resource= null;
            $resourceId = $handledRequest["resourceId"];
            if($resourceId !== null){
                $resourceId = intval($resourceId);
                if($resourceId > 0){
                    $resource = $mapper->find(ResourceDTO::class,$resourceId);
                    if(!$resource) throw new \Exception("No resource found with id '". resourceId ."'");
                }
            }
            else{
                $resourceId = 0;
            }
            $resourceMediator = $mediatorFactory->create(ResourceDTO::class,$resourceId,$resource);
            $groups = ['minimal'=>true,'activeVersion'=>['minimal'=>true,'file'=>true]];
            $resourceMediator->mapDTOGroups($groups);

            // if we upload for an existing resource we create a new version
            /** @var ResourceDTO $resource */
            $resourceDto = $resourceMediator->getDTO();
            if($resourceDto->getId()>0){
                $newActiveVersionDto = $mediatorFactory
                    ->create(ResourceVersionDTO::class)
                    ->mapDTOGroups(['minimal'=>true,'file'=>true])
                    ->getDTO();
                $newActiveVersionDto->setId($resourceDto->getId());
                $resourceDto->setActiveVersion($newActiveVersionDto);
            }
            else{
                $resourceDto->setName($handledRequest["name"]);
            }

            $versionDto = $resourceDto->getActiveVersion();
            /** @var ResourceVersionDTO $versionDto */
            $versionDto
                ->setName($handledRequest["name"])
                ->setFile($handledRequest["file"]);

            //$form = $formFactory->createBuilder(HFileUploadType::class,$version)->getForm();
            //$form->handleRequest($request);

            switch($handledRequest["resourceType"]->getId()){
                case ResourceType::IMAGE:
                    // TODO : see for better file validation later
                    /*$image = (new ResourceImageDTO())->setFile($version->getFile());
                    $errors = $this->get('validator')->validate($image);
                    if (count($errors)>0)
                    {
                        throw new \Exception($errors[0]->getMessage());
                    }*/
                    break;
                default:
                    break;
            }
            $resourceMediator->returnDataToEntity();
            $sequenceOfActions = $dbActionObserver->getSequenceOfActions();
            $mapper->executeSequence($sequenceOfActions);

            $backGroups = ['minimal'=>true,'activeVersion'=>['minimal'=>true,'urlMini'=>true,'urlDetailThumbnail'=>true]];
            $resourceMediator->mapDTOGroups($backGroups);
            $waoType = $waoHelper->getAbridgedName(ResourceDTO::class);
            $serialization = $normalizer->normalize($resourceMediator->getDTO(),$backGroups);

            $backData = [$waoType =>
                [$resourceMediator->getDTO()->getId()=>$serialization]
            ];

            $hResponse
                ->setData(json_encode($backData))
                ->setMessage("Le fichier a bien été chargé");
        }
        catch(\Exception $e){
            $hResponse->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage());
        }
        $mediatorFactory->finishAndClear();
        $dbActionObserver->finishAndClear();
        ob_clean();
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }
}
