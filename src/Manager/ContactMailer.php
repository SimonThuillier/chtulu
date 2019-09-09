<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 31/08/19
 * Time: 15:28
 */

namespace App\Manager;


use App\Entity\User;

class ContactMailer extends Mailer
{
    public function sendContactMessage(User $user,$type,$subject,$message)
    {
        $message = $this->newMessage()
            ->setTo($this->getWebmasterEmail())
            ->setSubject($this->getSiteName() . ' - Nouveau message user : ' . ContactManager::TYPES[$type])
            ->setBody($this->renderView('@HB/Mail/send-contact-message.html.twig',
                array(
                    'user' => $user,
                    'type' => ContactManager::TYPES[$type],
                    'subject' => $subject,
                    'message' => $message,
                    'siteName' => $this->getSiteName(),
                )),
                'text/html');
        $this->send($message);
    }

    public function sendContactMessageConfirmation(User $user,$type,$subject,$message)
    {
        $message = $this->newMessage()
            ->setTo($user->getEmail())
            ->setSubject('Votre message a bien été envoyé à ' . $this->getSiteName())
            ->setBody($this->renderView('@HB/Mail/send-message-confirmation.html.twig',
                array(
                    'user' => $user,
                    'type' => ContactManager::TYPES[$type],
                    'subject' => $subject,
                    'message' => $message,
                    'siteName' => $this->getSiteName(),
                )),
                'text/html');

        $this->send($message);
    }

}