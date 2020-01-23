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
use Symfony\Component\HttpFoundation\RedirectResponse;
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
            if(!in_array($handledRequest["email"],$this->getParameter('authorized_registration_emails'))){
                throw new \Exception('Désolé le site est encore en betatest et votre adresse mail <strong>' . $handledRequest["email"] .
                    "</strong> n'est pas sur la liste des adresses autorisées pour l'inscription. Contactez-moi sur le groupe Facebook <strong>" .
                    $this->getParameter('facebook_group_name') . "</strong> si vous desirez participer au betatest :)");
            }


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
     * @param string $email
     * @param string $token
     * @return RedirectResponse
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
                ->setMessage('Connexion réussie <strong>'. $user->getUsername() .'</strong>')
                ->setData(["redirectTo"=>$this->generateUrl(
                    'auth_homepage',
                    ['page'=>'welcome'],
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
     * @Route("/ask-password-recovery",name="ask_password_recovery")
     * @param Request $request
     * @param RequestHelper $requestHelper
     * @param SecurityManager $securityManager
     * @return JsonResponse
     */
    public function askPasswordRecoveryAction(
        Request $request,
        RequestHelper $requestHelper,
        SecurityManager $securityManager
    )
    {
        $hResponse = new HJsonResponse();
        try{
            $handledRequest = $requestHelper->handleAskPasswordRecoveryRequest($request);

            $result = $securityManager->askPasswordRecovery($handledRequest["login"]);
            /** @var PendingAction $action */
            $action = $result['action'];

            switch($result['resultCode']){
                case SecurityManager::RESULT_DONE:
                    $hResponse->setMessage('Votre demande a bien été prise en compte. 
                    Un mail de validation avec le lien vous permettant de changer de mot de passe a été envoyé à <strong>' . $action->getUser()->getEmail() . "</strong>.");
                    break;
                case SecurityManager::RESULT_RENEWED:
                    $hResponse->setMessage("Votre demande de reinitialisation de mot de passe du " . $action->getUpdatedAt()->format("d/m/Y à H:i") .
                        " avait expiré et a été renouvelée pour 24H. Un 
                    nouveau mail de validation a été envoyé à <strong>". $action->getUser()->getEmail() . "</strong>.");
                    break;
                case SecurityManager::RESULT_UPDATED:
                    $hResponse
                        ->setStatus(HJsonResponse::WARNING)
                        ->setMessage("Une demande de reinitialisation de mot de passe a déjà été faîte pour votre compte le " .
                            $action->getCreatedAt()->format("d/m/Y à H:i") . ". Verifiez la reception du mail de validation sur " . $action->getUser()->getEmail());
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
     * @Route("/change-password",name="change_password")
     * @param Request $request
     * @param RequestHelper $requestHelper
     * @param SecurityManager $securityManager
     * @param Session $session
     * @return JsonResponse
     */
    public function changePasswordAction(
        Request $request,
        RequestHelper $requestHelper,
        SecurityManager $securityManager,
        Session $session
    )
    {
        $hResponse = new HJsonResponse();
        try{
            $handledRequest = $requestHelper->handleChangePasswordRequest($request);
            $email = $handledRequest["email"];
            $password = $handledRequest["password"];
            $isAlreadyAuthenticated = $handledRequest["isAlreadyAuthenticated"];
            $token = $handledRequest["token"];

            $result = $securityManager->changePassword(
                $email,
                $password,
                $isAlreadyAuthenticated,
                $token);

            /** @var User $user */
            $user = $result['user'];

            switch($result['resultCode']){
                case SecurityManager::RESULT_DONE:
                    $hResponse
                        ->setStatus(HJsonResponse::SUCCESS)
                        ->setData(["login"=>$user->getEmail()])
                        ->setMessage("Votre mot de passe a bien été changé.<br/>
                        Vous pouvez l'utiliser pour vous connecter avec votre email <strong>". $user->getEmail() ."</strong> 
                        ou votre nom d'utilisateur <strong>". $user->getUsername() ."</strong>.")
                        ->setData(["redirectTo"=>$this->generateUrl(
                            'no-auth_homepage',
                            ['page'=>'login'],
                            UrlGeneratorInterface::ABSOLUTE_URL)]);
                    break;
                default:
                    throw new \Exception("");
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
                ->setMessage('Deconnexion reussie !')
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
