<?php

namespace App\Controller;

use App\DTO\ResourceDTO;
use App\DTO\ResourceImageDTO;
use App\DTO\ResourceVersionDTO;
use App\Entity\HResource;
use App\Entity\ResourceType;
use App\Entity\ResourceVersion;
use App\Factory\MediatorFactory;
use App\Form\HFileUploadType;
use App\Helper\RequestHelper;
use App\Helper\WAOHelper;
use App\Manager\File\FileRouter;
use App\Mapper\EntityMapper;
use App\Mapper\ResourceMapper;
use App\Mediator\ResourceDTOMediator;
use App\Observer\DBActionObserver;
use App\Serializer\DTONormalizer;
use App\Serializer\GeoJsonNormalizer;
use App\Serializer\ResourceDTONormalizer;
use App\Util\HJsonResponse;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 *
 * @author belze
 *         @Route("/resource")
 */
class ResourceController extends AbstractController
{
    /**
     * @param Request $request
     * @param RequestHelper $requestHelper
     * @param WAOHelper $waoHelper
     * @param ValidatorInterface $validator
     * @param EntityMapper $mapper
     * @param MediatorFactory $mediatorFactory
     * @param DTONormalizer $normalizer
     * @param DBActionObserver $dbActionObserver
     * @Route("/upload-resource",name="resource_upload")
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
