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
use App\Serializer\DTONormalizer;
use App\Serializer\GeoJsonNormalizer;
use App\Serializer\ResourceDTONormalizer;
use App\Utils\HJsonResponse;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
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
class ResourceController extends Controller
{
    /**
     * @param Request $request
     * @param RequestHelper $requestHelper
     * @param WAOHelper $waoHelper
     * @param ValidatorInterface $validator
     * @param EntityMapper $mapper
     * @param MediatorFactory $mediatorFactory
     * @param DTONormalizer $normalizer
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
                                         DTONormalizer $normalizer)
    {
        $hResponse = new HJsonResponse();

        try{
            $handledRequest = $requestHelper->handleUploadRequest($request);
            if(!$this->isCsrfTokenValid('token_id', $handledRequest["_token"]))
                throw new \Exception("Invalid token : would you hack history ?");

            $resource= null;
            if($handledRequest["resourceId"] !== null){
                $resource = $mapper->find(ResourceDTO::class,$handledRequest["resourceId"]);
                if(!$resource) throw new \Exception("No resource found with id '". $handledRequest["resourceId"] ."'");
            }
            $resourceMediator = $mediatorFactory->create(ResourceDTO::class,$resource);
            $groups = ['minimal'=>true,'activeVersion'=>['minimal'=>true,'file'=>true]];
            $resourceMediator->mapDTOGroups($groups);

            // if we upload for an existing resource we create a new version
            /** @var ResourceDTO $resource */
            $resource = $resourceMediator->getDTO();
            if($resource->getId()>0){
                $newActiveVersion = $mediatorFactory
                    ->create(ResourceVersionDTO::class)
                    ->mapDTOGroups(['minimal'=>true,'file'=>true])
                    ->getDTO();
                $resource->setActiveVersion($newActiveVersion);
            }
            else{
                $resource->setName($handledRequest["name"]);
            }

            $version = $resource->getActiveVersion();
            $version->setName($handledRequest["name"]);
            $version->setFile($handledRequest["file"]);

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
            $mapperCommands = $resourceMediator->returnDataToEntity();
            $mapper->executeCommands($mapperCommands);


            $backGroups = ['minimal'=>true,'activeVersion'=>['minimal'=>true,'urlMini'=>true,'urlDetailThumbnail'=>true]];
            $resourceMediator->mapDTOGroups($backGroups);
            $waoType = $waoHelper->getAbridgedName(ResourceDTO::class);
            $resourceId = $resource->getId();
            $serialization = $normalizer->normalize($resource,$backGroups);
            $truc = "lol";

            $backData = [$waoType =>
                [$resourceId=>$serialization]
            ];

            $hResponse
                ->setData(json_encode($backData))
                ->setMessage("Le fichier a bien été chargé");
        }
        catch(\Exception $e){
            $hResponse->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage());
        }

        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }

    /**
     * @Route("/get-resource-url/{resource}/{vNumber}/{filter}",
     * name="resource_get_resource_url",requirements={"vNumber" = "\d*","filter" = "\w*"})
     * @ParamConverter("resource", class="AppBundle:HResource")
     * @Method({"GET"})
     */
    public function getResourceUrlAction(Request $request,
                                            HResource $resource,
                                            $vNumber=null,
                                            $filter=null,
                                            ManagerRegistry $doctrine,
                                            FileRouter $router){
        if($filter ==="") $filter=null;
        $versionRepository = $doctrine->getRepository(ResourceVersion::class);
        /** @var ResourceVersion $version */
        if($vNumber === null){
            $version = $versionRepository->findOneBy(["resource"=>$resource,"active"=>true]);
        }
        else{
            $version = $versionRepository->findOneBy(["resource"=>$resource,"number"=>$vNumber]);
        }

        return $this->render("@App/Test/test.html.twig",["msg" =>$router->getVersionRoute($version,$filter)]);
    }

    /**
     * @Route("/get-resource/{resource}/{vNumber}/{filter}",
     * name="resource_get_resource",requirements={"vNumber" = "\d*","filter" = "\w*"})
     * @ParamConverter("resource", class="AppBundle:HResource")
     * @Method({"GET"})
     */
    public function getResourceAction(Request $request,
                                         HResource $resource,
                                         $vNumber=null,
                                         $filter=null,
                                         ManagerRegistry $doctrine,
                                         FileRouter $router){
        if($filter ==="") $filter=null;
        $versionRepository = $doctrine->getRepository(ResourceVersion::class);
        /** @var ResourceVersion $version */
        if($vNumber === null){
            $version = $versionRepository->findOneBy(["resource"=>$resource,"active"=>true]);
        }
        else{
            $version = $versionRepository->findOneBy(["resource"=>$resource,"number"=>$vNumber]);
        }

        return $this->redirect($router->getVersionRoute($version,$filter));
    }

    /**
     * @param Request $request
     * @param MediatorFactory $mediatorFactory
     * @param ResourceMapper $mapper
     * @param ResourceDTONormalizer $normalizer
     * @Route("/post-geometry",name="resource_post_create_geometry")
     * @Method({"POST"})
     * @throws \Exception
     * @return JsonResponse
     */
    public function postCreateGeometryAction(Request $request,
                                          MediatorFactory $mediatorFactory,
                                          ResourceMapper $mapper,
                                          GeoJsonNormalizer $normalizer)
    {
        $groups = ['minimal','activeImage'=>['minimal']];

        $mediator = $mediatorFactory->create(ResourceDTOMediator::class);

        /** @var ResourceDTO $resourceDto */
        $resourceDto = $mediator
            ->mapDTOGroups(array_merge($groups,[]))
            ->getDTO();
        /** @var ResourceVersionDTO $versionDto */
        $versionDto = $resourceDto->getActiveVersion()->setName(null);

        $form = $this->get('form.factory')
            ->createBuilder(HFileUploadType::class,$versionDto)
            ->getForm();

        $mediator->resetChangedProperties();
        $hResponse = new HJsonResponse();
        $errors=[];
        try{
            $form->handleRequest($request);
            $versionDto->setName($request->get('name'));
            $resourceDto->setName($request->get('name'));
            $errors = $this->get('validator')->validate($versionDto);
            if (! $form->isValid() || count($errors)>0)
            {
                throw new \Exception("Le formulaire contient des erreurs à corriger avant chargement");
            }
            $mapper->add($resourceDto);

            $mediator->mapDTOGroups(["minimal",'activeImage'=>['minimal',"urlMini","urlDetailThumbnail"]]);
            $hResponse->setMessage("Le fichier a bien été chargé")
                ->setData($normalizer->normalize($resourceDto,['minimal',"activeVersion"=>["urlMini","minimal","urlDetailThumbnail"]
                ]))
                ->setStatus(HJsonResponse::SUCCESS);
        }
        catch(\Exception $e){
            $hResponse->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage())
                ->setErrors(HJsonResponse::normalizeFormErrors($errors));
        }

        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }






}
