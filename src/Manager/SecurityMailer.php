<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 31/08/19
 * Time: 15:28
 */

namespace App\Manager;


use App\Entity\User;

class SecurityMailer extends Mailer
{
    public function sendAskRegistration($email,$token)
    {
        $message = $this->newMessage()
            ->setTo($email)
            ->setSubject('Confirmation de votre inscription à ' . $this->getSiteName())
            ->setBody($this->renderView('@HB/Mail/ask-registration.html.twig',
                array(
                    'email' => $email,
                    'token' => $token,
                    'siteName' => $this->getSiteName(),
                )),
                'text/html');

        $this->send($message);
    }

    public function sendRegistrationConfirmation(User $user)
    {
        $message = $this->newMessage()
            ->setTo($user->getEmail())
            ->setSubject('Merci de vous êtes inscrit à ' . $this->getSiteName())
            ->setBody($this->renderView('@HB/Mail/registration-confirmation.html.twig',
                array(
                    'user' => $user,
                    'siteName' => $this->getSiteName(),
                )),
                'text/html');

        $this->send($message);
    }

}