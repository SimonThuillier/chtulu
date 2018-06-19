<?php

namespace AppBundle\Controller;

use AppBundle\DTO\ResourceDTO;
use AppBundle\DTO\ResourceVersionDTO;
use AppBundle\Factory\ResourceDTOFactory;
use AppBundle\Factory\ResourceFactory;
use AppBundle\Factory\ResourceVersionDTOFactory;
use AppBundle\Factory\ResourceVersionFactory;
use AppBundle\Form\HFileUploadType;
use AppBundle\Mapper\ResourceMapper;
use AppBundle\Mediator\ResourceDTOMediator;
use AppBundle\Mediator\ResourceVersionDTOMediator;
use AppBundle\Utils\HJsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

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
                                          ResourceVersionFactory $versionFactory,ResourceVersionDTOFactory $versionDtoFactory,
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
        $resourceDto->setActiveVersion($versionDto);

        $form = $this->get('form.factory')
            ->createBuilder(HFileUploadType::class,$versionDto)->getForm();


        $mediator->resetChangedProperties();
        $form->handleRequest($request);

        $mapper->setMediator($mediator);
        $mapper->add();

        $hResponse = new HJsonResponse();
        $hResponse->setMessage("J'ai bien recu un truc !");
        $hResponse->setStatus(HJsonResponse::SUCCESS);

        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }


}
