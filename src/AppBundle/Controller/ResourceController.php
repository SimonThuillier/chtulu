<?php

namespace AppBundle\Controller;

use AppBundle\DTO\ResourceDTO;
use AppBundle\DTO\ResourceVersionDTO;
use AppBundle\Entity\HResource;
use AppBundle\Entity\ResourceVersion;
use AppBundle\Factory\ResourceDTOFactory;
use AppBundle\Factory\ResourceFactory;
use AppBundle\Factory\ResourceImageDTOFactory;
use AppBundle\Factory\ResourceVersionDTOFactory;
use AppBundle\Factory\ResourceVersionFactory;
use AppBundle\Form\HFileUploadType;
use AppBundle\Image\LocalDataLoader;
use AppBundle\Manager\File\FileRouter;
use AppBundle\Mapper\ResourceMapper;
use AppBundle\Mediator\ResourceDTOMediator;
use AppBundle\Mediator\ResourceVersionDTOMediator;
use AppBundle\Repository\ResourceVersionRepository;
use AppBundle\Utils\HJsonResponse;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

/**
 *
 * @author belze
 *         @Route("/resource")
 */
class ResourceController extends Controller
{
    /**
     * @Route("/post-upload-image",name="resource_post_upload_image")
     * @Method({"POST"})
     */
    public function postUploadImageAction(Request $request, ResourceDTOMediator $mediator,
                                          ResourceFactory $entityFactory,ResourceDTOFactory $dtoFactory,
                                          ResourceVersionDTOMediator $versionMediator,
                                          ResourceVersionFactory $versionFactory,ResourceImageDTOFactory $versionDtoFactory,
                                          ResourceMapper $mapper)
    {
        $groups = ['minimal'];
        $versionGroups = ['minimal'];

        /** @var ResourceDTO $resourceDto */
        $resourceDto = $mediator
            ->setEntity($entityFactory->create($this->getUser()))
            ->setDTO($dtoFactory->create($this->getUser()))
            ->mapDTOGroups(array_merge($groups,[]))
            ->getDTO();
        /** @var ResourceVersionDTO $versionDto */
        $versionDto = $versionMediator
            ->setEntity($versionFactory->create($this->getUser()))
            ->setDTO($versionDtoFactory->create($this->getUser()))
            ->mapDTOGroups(array_merge($versionGroups,[]))
            ->getDTO();
        $versionDto->setName(null);
        $resourceDto->setActiveVersion($versionDto);

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
            $errors = $this->get('validator')->validate($versionMediator->getDTO());
            if (! $form->isValid() || count($errors)>0)
            {
                throw new \Exception("Le formulaire contient des erreurs à corriger avant chargement");
            }

            $mapper->setMediator($mediator);
            $mapper->add();

            $hResponse->setMessage("Le fichier a bien été chargé");
            $hResponse->setStatus(HJsonResponse::SUCCESS);
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
