<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 01/09/19
 * Time: 22:24
 */

namespace App\Listener;

use App\Util\HJsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\Routing\RouterInterface;

class ExceptionListener
{
    private $router;
    private $session;

    public function __construct(
        Session $session,
        RouterInterface $router
    )
    {
        $this->session = $session;
        $this->router = $router;
    }


    public function onKernelException(ExceptionEvent $event)
    {
        $exception = $event->getException();
        if(get_class($exception) === HttpException::class
            && $exception->getMessage() === "A Token was not found in the TokenStorage."
        ){
            $this->session->remove('initialHResponse');
            $hResponse = new HJsonResponse();
            $hResponse
                ->setStatus(HJsonResponse::WARNING)
                ->setMessage("Vous devez vous <strong>connecter</strong> pour acceder à cette page");
            $this->session->set('initialHResponse',HJsonResponse::normalize($hResponse));

            $event->setResponse(new RedirectResponse($this->router->generate('no-auth_homepage',['page'=>'login'])));
        }
    }
}