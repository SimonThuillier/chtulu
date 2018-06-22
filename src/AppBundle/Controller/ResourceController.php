<?php

namespace AppBundle\Controller;

use AppBundle\DTO\ResourceDTO;
use AppBundle\DTO\ResourceVersionDTO;
use AppBundle\Factory\ResourceDTOFactory;
use AppBundle\Factory\ResourceFactory;
use AppBundle\Factory\ResourceImageDTOFactory;
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
            $errors = $this->get('validator')->validate($versionMediator->getDTO());
            if (! $form->isValid() || count($errors)>0)
            {
                $truc = $this->getParameter('hb_resources');
                var_dump($truc);
                throw new \Exception("Le formulaire contient des erreurs à corriger avant chargement");
            }

            $mapper->setMediator($mediator);
            $mapper->add();

            $hResponse->setMessage("J'ai bien recu un truc !");
            $hResponse->setStatus(HJsonResponse::SUCCESS);
        }
        catch(\Exception $e){
            $hResponse->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage())
                ->setErrors(HJsonResponse::normalizeFormErrors($errors));
        }

        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }


}
