<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\HttpFoundation\Session\Session;

/**
 * @Route("")
 */
class SecurityController extends Controller
{

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

        return $this->render('AppBundle:Security:login.html.twig', array(
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
