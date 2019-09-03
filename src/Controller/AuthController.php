<?php

namespace App\Controller;

use App\DTO\UserDTO;
use App\Entity\User;
use App\Factory\MediatorFactory;
use App\Mediator\DTOMediator;
use App\Serializer\DTONormalizer;
use App\Util\HJsonResponse;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Route("/app", name="auth_")
 */
class AuthController extends AbstractController
{
    /**
     * main controller for loading the spa
     * @Route("/{page}", name="homepage",requirements={"page"=".+"})
     * @param string|null $page
     * @param Request $request
     * @param Session $session
     * @param MediatorFactory $mediatorFactory
     * @param DTONormalizer $normalizer
     * @throws \Exception
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     * @return mixed
     */
    public function indexAction(
        $page,
        Request $request,
        Session $session,
        MediatorFactory $mediatorFactory,
        DTONormalizer $normalizer
    )
    {
        /** @var User $user */
        $user = $this->getUser();

        if($user === null){
            $session->remove('initialHResponse');
            $hResponse = new HJsonResponse();
            $hResponse
                ->setStatus(HJsonResponse::WARNING)
                ->setMessage("Vous devez vous <strong>connecter</strong> pour acceder à cette page");
            $session->set('initialHResponse',HJsonResponse::normalize($hResponse));
            return $this->redirectToRoute('no-auth_homepage',['page'=>'login']);
        }

        $hResponse = null;
        if($session->has('initialHResponse')){
            $hResponse = $session->get('initialHResponse',$hResponse);
            $session->remove('initialHResponse');

            if(is_string($hResponse)) $hResponse = json_decode($hResponse,true);
            if(empty($hResponse)) $hResponse = null;
        }

        if($hResponse === null){
            $hResponse = new HJsonResponse();
            $hResponse->setStatus(HJsonResponse::CONFIRM);
            $hResponse = HJsonResponse::normalize($hResponse);
        }

        try{
            $mediator = $mediatorFactory
                ->create(UserDTO::class ,
                $user->getId(),
                $user,
                null,
                DTOMediator::NOTHING_IF_NULL);

            $userGroups = ['minimal'=>true,'email'=>true,'description'=>true,
                'detailImage'=>['minimal'=>true,'activeVersion'=>true]];
            $mediator->mapDTOGroups($userGroups);

            $userDTO = $mediator->getDTO();
            $hResponse["data"]["currentUser"] = $normalizer->normalize($userDTO,$userGroups);
        }
        catch(\Exception $e){
            $hResponse["status"] = HJsonResponse::ERROR;
            $hResponse["message"] = "<strong>Oups !</strong>J'ai cru voir une erreur technique. <small>Je fais tout pour la corriger au plus vite, promis :)</small>"
                . $e->getMessage();
        }

        return $this->render('@HB/auth.html.twig', ['hResponse'=>json_encode($hResponse)]);
    }
}
