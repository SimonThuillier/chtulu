<?php

namespace AppBundle\Controller;

use AppBundle\DTO\ResourceDTO;
use AppBundle\DTO\ResourceImageDTO;
use AppBundle\DTO\ResourceVersionDTO;
use AppBundle\Entity\HResource;
use AppBundle\Entity\ResourceVersion;
use AppBundle\Factory\DTOFactory;
use AppBundle\Factory\EntityFactory;
use AppBundle\Factory\MediatorFactory;
use AppBundle\Form\HFileUploadType;
use AppBundle\Manager\File\FileRouter;
use AppBundle\Mapper\ResourceMapper;
use AppBundle\Mediator\ResourceDTOMediator;
use AppBundle\Serializer\ResourceDTONormalizer;
use AppBundle\Utils\HJsonResponse;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

/**
 *
 * @author belze
 *         @Route("/resource")
 */
class ResourceController extends Controller
{
    /**
     * @param Request $request
     * @param MediatorFactory $mediatorFactory
     * @param ResourceMapper $mapper
     * @param ResourceDTONormalizer $normalizer
     * @Route("/post-upload-image",name="resource_post_upload_image")
     * @Method({"POST"})
     * @throws \Exception
     * @return JsonResponse
     */
    public function postUploadImageAction(Request $request,
                                          MediatorFactory $mediatorFactory,
                                          ResourceMapper $mapper,
                                          ResourceDTONormalizer $normalizer)
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




}
