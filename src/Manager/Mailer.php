<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 31/08/19
 * Time: 15:08
 */

namespace App\Manager;
use Psr\Container\ContainerInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Twig\Environment;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Contracts\Service\ServiceSubscriberInterface;

abstract class Mailer implements ServiceSubscriberInterface
{
    /**
     * @var ContainerInterface
     */
    private $container;
    private $mailer;

    public function __construct(
        \Swift_Mailer $mailer,
        ContainerInterface $container

    )
    {
        $this->mailer = $mailer;
        $this->container = $container;
    }

    public static function getSubscribedServices()
    {
        return [
            'router' => '?'.RouterInterface::class,
            'session' => '?'.SessionInterface::class,
            'twig' => '?'.Environment::class,
            'security.token_storage' => '?'.TokenStorageInterface::class,
            'security.csrf.token_manager' => '?'.CsrfTokenManagerInterface::class,
            'parameter_bag' => '?'.ContainerBagInterface::class,
        ];
    }

    public function getSiteName()
    {
        return 'HistoricaBase';
    }

    public function getWebmasterEmail()
    {
        return $this->container->get('parameter_bag')->get('webmaster_email');
    }



    protected function generateUrl($route, array $parameters = array())
    {
        return $this->container->get('router')->generate($route, $parameters, true);
    }

    protected function renderView($view, array $parameters = array())
    {
        return $this->container->get('twig')->render($view, $parameters);
    }

    /**
     * @return \Swift_Message
     */
    protected function newMessage()
    {
        return (new \Swift_Message())->setFrom('send@example.com');
    }

    protected function send(\Swift_Message $message)
    {
        $this->mailer->send($message);
    }
}