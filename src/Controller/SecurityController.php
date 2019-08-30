<?php
namespace App\Controller;

use App\Helper\RequestHelper;
use App\Util\HJsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\HttpFoundation\Session\Session;

/**
 * @Route("/_security", name="security_")
 */
class SecurityController extends AbstractController
{
    /**
     * @Route("/register",name="register")
     * @param Request $request
     * @param RequestHelper $requestHelper
     * @return JsonResponse
     */
    public function registerAction(
        Request $request,
        RequestHelper $requestHelper,
        \Swift_Mailer $mailer
    )
    {
        $hResponse = new HJsonResponse();
        try{
            $handledRequest = $requestHelper->handleRegisterRequest($request);

            $hResponse
                ->setStatus(HJsonResponse::ERROR)
                ->setMessage("L'adresse est déjà utilisée")
                ->setData(['dataTest' => 'test'])
                ->setSenderKey($handledRequest["senderKey"]);

            $message = (new \Swift_Message('Hello Email'))
                ->setFrom('send@example.com')
                ->setTo('simon.thuillier@prestataires.tdf.fr')
                ->setBody(
                    $this->renderView(
                    // templates/hello/email.txt.twig
                        'Mail/test.html.twig',
                        ['name' => 'simon']
                    )
                )
            ;

            $mailer->send($message);



        }
        catch(\Exception $e){
            $hResponse
                ->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage());
        }

        ob_clean();
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }

    /**
     * @Route("/login",name="login")
     */
    public function loginAction(Request $request, AuthenticationUtils $authUtils)
    {
        // get the login error if there is one
        $error = $authUtils->getLastAuthenticationError();

        // last username entered by the user
        $lastUsername = $authUtils->getLastUsername();

        /** @var Session $session */
        $session = $this->get('session');
        if ($request->getMethod() === "POST" && $error === null) {
            $session->getFlashBag()->add('success', 'Bienvenue ' . $this->get('security.token_storage')
                ->getToken()
                ->getUser());
        }

        return $this->render('@HB/Security/login.html.twig', array(
            'last_username' => $lastUsername,
            'error' => $error
        ));
    }

    /**
     * @Route("/logout",name="logout")
     *
     * @param Request $request
     */
    public function logoutAction(Request $request)
    {
        $session->getFlashBag()->add('success', 'Merci de votre visite');
    }
}
