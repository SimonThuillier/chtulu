<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 31/08/19
 * Time: 14:58
 */

namespace App\Manager;


use App\Entity\User;
use App\Factory\EntityFactory;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ContactManager
{
    const TYPES = [
        'BUG'=> 'Rapport de bug',
        'PROBLEM'=>'Signalement d\'abus',
        'HOWTO'=>'Comment faire',
        'IDEA'=>'Idée et proposition',
        'ABOUT'=>'Question sur le projet',
        'THANKS'=>'Remerciements'
    ];

    const RESULT_DONE = 'DONE';

    /** ManagerRegistry $em */
    private $doctrine;
    private $validator;
    private $encoder;

    private $entityFactory;

    private $mailer;

    private $router;

    public function __construct(
        ManagerRegistry $doctrine,
        ValidatorInterface $validator,
        UserPasswordEncoderInterface $encoder,
        EntityFactory $entityFactory,
        ContactMailer $mailer,
        RouterInterface $router
    )
    {
        $this->doctrine = $doctrine;
        $this->validator = $validator;
        $this->encoder = $encoder;

        $this->entityFactory = $entityFactory;
        $this->mailer = $mailer;
        $this->router = $router;
    }

    /**
     * @param User $sender
     * @param string $type
     * @param string $subject
     * @param string $message
     * @throws \Exception
     * @return bool
     */
    public function sendMessage(
        User $sender,
        string $type,
        string $subject,
        string $message)
    {
        if(empty($type) || !in_array($type,array_keys(self::TYPES))){
            throw new \Exception('Le type de contact <strong>' . $type . '</strong> est inconnu.');
        }

        $this->mailer->sendContactMessage($sender,$type,$subject,$message);
        $this->mailer->sendContactMessageConfirmation($sender,$type,$subject,$message);

        return true;
    }
}