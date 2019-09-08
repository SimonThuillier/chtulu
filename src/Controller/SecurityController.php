<?php
namespace App\Controller;

use App\Entity\PendingAction;
use App\Entity\User;
use App\Helper\RequestHelper;
use App\Manager\SecurityManager;
use App\Util\HJsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @Route("/_security", name="security_")
 */
class SecurityController extends AbstractController
{
    /**
     * @Route("/check-path", name="check_path")
     */
    public function checkPathAction(Request $request)
    {
    }

    /**
     * @Route("/register",name="register")
     * @param Request $request
     * @param RequestHelper $requestHelper
     * @param SecurityManager $securityManager
     * @return JsonResponse
     */
    public function registerAction(
        Request $request,
        RequestHelper $requestHelper,
        SecurityManager $securityManager
    )
    {
        $hResponse = new HJsonResponse();
        try{
            $handledRequest = $requestHelper->handleRegisterRequest($request);
            $result = $securityManager->askRegistration($handledRequest["email"],$handledRequest["password"]);
            /** @var PendingAction $action */
            $action = $result['action'];

            switch($result['resultCode']){
                case SecurityManager::RESULT_DONE:
                    $hResponse->setMessage('Votre inscription a bien été prise en compte. 
                    Un mail de validation a été envoyé à <strong>' . $action->getEmail() . "</strong>.");
                    break;
                case SecurityManager::RESULT_RENEWED:
                    $hResponse->setMessage("Votre demande d'inscription du " . $action->getUpdatedAt()->format("d/m/Y à H:i") .
                        " avait expiré et a été renouvelée pour 24H. Un 
                    nouveau mail de validation a été envoyé à <strong>". $action->getEmail() . "</strong>.");
                    break;
                case SecurityManager::RESULT_UPDATED:
                    $hResponse
                        ->setStatus(HJsonResponse::WARNING)
                        ->setMessage("Une demande d'inscription a déjà été faîte le " .
                            $action->getCreatedAt()->format("d/m/Y à H:i") . " pour le mail <strong>" . $action->getEmail() . "</strong>.");
                    break;
                default:
                    break;
            }
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
     * @Route("/validate-register/{email}/{token}",name="validate_register")
     * @param Request $request
     * @param RequestHelper $requestHelper
     * @param string $email
     * @param string $token
     */
    public function validateRegisterAction(
        Request $request,
        SecurityManager $securityManager,
        string $email,
        string $token,
        Session $session
    )
    {
        $session->remove('initialHResponse');
        $hResponse = new HJsonResponse();
        try{
            $result = $securityManager->askValidateRegistration($email,$token);
            /** @var PendingAction $action */
            $action = $result['action'];
            /** @var User $user */
            $user = $result['user'];

            switch($result['resultCode']){
                case SecurityManager::RESULT_NOTHING:
                    $hResponse
                        ->setStatus(HJsonResponse::INFO)
                        ->setData(["login"=>$email])
                        ->setMessage("Le mail <strong>" . $email . "</strong> 
                    est déjà inscrit. Il n'y a plus qu'à vous connecter :)");
                    $session->set('initialHResponse',HJsonResponse::normalize($hResponse));
                    return $this->redirectToRoute('no-auth_homepage',['page'=>'login']);
                    break;
                case SecurityManager::RESULT_TO_RENEW:
                    $hResponse
                        ->setStatus(HJsonResponse::WARNING)
                        ->setData(["login"=>$email])
                        ->setMessage("Votre demande d'inscription du " . $action->getUpdatedAt()->format("d/m/Y à H:i") .
                            " a expiré et doit être renouvelée. Un 
                    nouveau mail de validation sera envoyé à <strong>". $action->getEmail() . "</strong>.");
                    $session->set('initialHResponse',HJsonResponse::normalize($hResponse));
                    return $this->redirectToRoute('no-auth_homepage',['page'=>'register']);
                    break;
                case SecurityManager::RESULT_DONE:
                    $hResponse
                        ->setStatus(HJsonResponse::SUCCESS)
                        ->setData(["login"=>$user->getEmail()])
                        ->setMessage("Votre inscription est désormais terminée ! :) <br/>
                        Vous pouvez vous connecter avec votre email <strong>". $user->getEmail() ."</strong> 
                        ou votre nom d'utilisateur par défaut <strong>". $user->getUsername() ."</strong>");
                    $session->set('initialHResponse',HJsonResponse::normalize($hResponse));
                    break;
                default:
                    break;
            }
        }
        catch(\Exception $e){
            $hResponse
                ->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage());
            $session->set('initialHResponse',HJsonResponse::normalize($hResponse));
            return $this->redirectToRoute('no-auth_homepage',['page'=>'register']);
        }

        return $this->redirectToRoute('no-auth_homepage',['page'=>'login']);
    }

    /**
     * @Route("/login/{login}",name="login")
     * @param string|null $login
     * @param Request $request
     * @param RequestHelper $requestHelper
     * @param SecurityManager $securityManager
     * @param Session $session
     * @param TokenStorageInterface $tokenStorage
     * @param EventDispatcherInterface $eventDispatcher
     * @return mixed
     */
    public function loginAction(
        $login=null,
        Request $request,
        RequestHelper $requestHelper,
        SecurityManager $securityManager,
        Session $session,
        TokenStorageInterface $tokenStorage,
        EventDispatcherInterface $eventDispatcher
    )
    {
        $session->remove('initialHResponse');
        $hResponse = new HJsonResponse();

        if ($request->getMethod() === 'GET') {
            $hResponse
                ->setStatus(HJsonResponse::CONFIRM)
                ->setData(($login!==null && !empty($login))?["login"=>$login]:null);
            $session->set('hResponse',HJsonResponse::normalize($hResponse));
            return $this->redirectToRoute('no-auth_homepage',['page'=>'login']);
        }

        /** POST case e.g. someone wants to login */
        try{
            $handledRequest = $requestHelper->handleLoginRequest($request);

            $user = $securityManager->login(
                $handledRequest['login'],
                $handledRequest['password'],
                $request,
                $session,
                $tokenStorage,
                $eventDispatcher
            );

            $hResponse
                ->setMessage('Connexion reussie <strong>'. $user->getUsername() .'</strong>!')
                ->setData(["redirectTo"=>$this->generateUrl(
                    'auth_homepage',
                    ['page'=>'explorer'],
                    UrlGeneratorInterface::ABSOLUTE_URL)]);
        }
        catch(\Exception $e){
            $hResponse
                ->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage());
            ob_clean();
            return new JsonResponse(HJsonResponse::normalize($hResponse));
        }

        ob_clean();
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }

    /**
     * @Route("/logout",name="logout")
     * @param Request $request
     * @param Session $session
     * @return JsonResponse
     */
    public function logoutAction(
        Request $request,
        Session $session
    )
    {
        $session->remove('initialHResponse');
        $hResponse = new HJsonResponse();

        try{
            $hResponse
                ->setMessage('Deconnection reussie !')
                ->setData(["redirectTo"=>$this->generateUrl(
                    'no-auth_homepage',
                    ['page'=>'login'],
                    UrlGeneratorInterface::ABSOLUTE_URL)]);
        }
        catch(\Exception $e) {
            $hResponse
                ->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage());
        }

        ob_clean();
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }
}
