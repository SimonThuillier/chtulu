<?php
namespace App\Controller;

use App\Entity\User;
use App\Helper\RequestHelper;
use App\Manager\ContactManager;
use App\Util\HJsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Route("/_contact", name="contact_")
 */
class ContactController extends AbstractController
{
    /**
     * @Route("/contact", name="contact")
     * @param Request $request
     * @param RequestHelper $requestHelper
     * @param ContactManager $contactManager
     * @return JsonResponse
     */
    public function ContactAction(
        Request $request,
        RequestHelper $requestHelper,
        ContactManager $contactManager
    )
    {
        $hResponse = new HJsonResponse();

        /** @var User $user */
        $user = $this->getUser();


        try{
            $handledRequest = $requestHelper->handleContactRequest($request);
            $contactManager->sendMessage(
                $user,
                $handledRequest['type'],
                $handledRequest['subject'],
                $handledRequest['message']
                );

            $hResponse->setMessage('Votre message a bien été envoyé et nous allons y répondre au plus vite :).
                    Un mail de confirmation vous a été envoyé à <strong>' . $user->getEmail() . "</strong> ");
        }
        catch(\Exception $e){
            $hResponse
                ->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage());
        }

        ob_clean();
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }
}
