<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 31/08/19
 * Time: 14:58
 */

namespace App\Manager;


use App\Entity\PendingAction;
use App\Entity\User;
use App\Factory\EntityFactory;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class SecurityManager
{
    const RESULT_DONE = 'DONE';
    const RESULT_UPDATED = 'UPDATED';
    const RESULT_RENEWED = 'RENEWED';

    const RESULT_NOTHING = 'NOTHING';
    const RESULT_TO_RENEW = 'TO_RENEW';


    /** ManagerRegistry $em */
    private $doctrine;
    private $validator;
    private $encoder;

    private $entityFactory;

    private $mailer;

    public function __construct(
        ManagerRegistry $doctrine,
        ValidatorInterface $validator,
        UserPasswordEncoderInterface $encoder,
        EntityFactory $entityFactory,
        SecurityMailer $mailer
    )
    {
        $this->doctrine = $doctrine;
        $this->validator = $validator;
        $this->encoder = $encoder;

        $this->entityFactory = $entityFactory;
        $this->mailer = $mailer;
    }

    /**
     * @param string $email
     * @param string $password
     * @throws \Exception
     * @return array
     */
    public function askRegistration(string $email,string $password)
    {
        if($this->doctrine->getRepository(User::class)->emailExists($email)){
            throw new \Exception('Un utilisateur avec le mail <strong>' . $email . '</strong> existe déjà. Veuillez en choisir un autre.');
        }

        $pendingAction = $this->doctrine->getRepository(PendingAction::class)
            ->findBy(['type'=>PendingAction::REGISTRATION,'email'=>$email],['updatedAt'=>'DESC']);
        if(is_array($pendingAction) && count($pendingAction)>0) $pendingAction = $pendingAction[0];
        else $pendingAction = null;
        /** @var PendingAction $pendingAction */

        $resultCode = self::RESULT_UPDATED;
        if($pendingAction === null){
            $pendingAction = $this->entityFactory->create(PendingAction::class);
            $pendingAction
                ->setEmail($email)
                ->setType(PendingAction::REGISTRATION)
                ->setExpirationDelay(1440)
                ->setToken(self::generateToken());
            $this->doctrine->getManager()->persist($pendingAction);
            $resultCode = self::RESULT_DONE;
        }
        elseif($pendingAction->getExecutionStatus() === PendingAction::STATUS_EXPIRED){
            $pendingAction
                ->setToken(self::generateToken())
                ->setUpdatedAt(new \DateTime());
            $resultCode = self::RESULT_RENEWED;
        }

        $pendingAction->setData(json_encode(['stuff'=>$password]));

        $this->doctrine->getManager()->flush();

        if(in_array($resultCode,[self::RESULT_DONE,self::RESULT_RENEWED])){
            $this->mailer->sendAskRegistration($email,$pendingAction->getToken());
        }

        return ['action'=>$pendingAction,'resultCode'=>$resultCode];
    }

    /**
     * @param string $email
     * @param string $token
     * @throws \Exception
     * @return array
     */
    public function askValidateRegistration(string $email,string $token)
    {
        /** A controls */
        $existingUser = $this->doctrine->getRepository(User::class)->findOneBy(['email'=>$email]);
        if($existingUser !== null){
            return ['user'=>$existingUser,'action'=>null,'resultCode'=>self::RESULT_NOTHING];
        }
        elseif(! $this->doctrine->getRepository(PendingAction::class)->tokenExists($token,PendingAction::REGISTRATION)){
            throw new \Exception('Le token de sécurité est invalide.');
        }

        $pendingAction = $this->doctrine->getRepository(PendingAction::class)
            ->findBy(['type'=>PendingAction::REGISTRATION,'email'=>$email],['updatedAt'=>'DESC']);
        if(is_array($pendingAction) && count($pendingAction)>0) $pendingAction = $pendingAction[0];
        else $pendingAction = null;

        if($pendingAction === null){
            throw new \Exception("L'utilisateur avec le mail " . $email . " n'existe pas. Inscrivez-vous.");
        }

        /** @var PendingAction $pendingAction */
        $status = $pendingAction->getExecutionStatus();
        if($status === PendingAction::STATUS_EXPIRED){
            return ['user'=>null,'action'=>$pendingAction,'resultCode'=>self::RESULT_TO_RENEW];
        }
        elseif($status === PendingAction::STATUS_DONE){
            throw new \Exception("L'utilisateur avec le mail " . $email . " n'existe pas. Inscrivez-vous.");
        }
        elseif($status !== PendingAction::STATUS_VALID){
            throw new \Exception("Un problème inconnu empeche de traiter l'action : reinscrivez-vous.");
        }

        /** B actions */
        $actionData = json_decode($pendingAction->getData(),true);
        $password = $actionData['stuff'];
        $matches=[];
        preg_match('/^(.+)@(.+)$/', $email, $matches);
        $username = $matches[1];

        $user = $this->createUser($email,$password,$username);

        $this->doctrine->getManager()->remove($pendingAction);
        $this->doctrine->getManager()->flush();

        $this->mailer->sendRegistrationConfirmation($user);

        return ['user'=>$user,'action'=>$pendingAction,'resultCode'=>self::RESULT_DONE];
    }

    /**
     * Main secured function to create users in HB project
     * @param $email string
     * @param $password string
     * @param $username string
     * @return User
     * @throws \Exception
     */
    public function createUser(
        string $email,
        string $password,
        string $username
    )
    {
        if(empty($email) || empty($password) || empty($username)){
            throw new \Exception('les email,username et mot de passe sont nécessaires pour creer un utilisateur');
        }
        if($this->doctrine->getRepository(User::class)->emailExists($email)){
            throw new \Exception('Un utilisateur avec le mail ' . $email . ' existe déjà. Veuillez en choisir un autre.');
        }

        // to prevent two identical username
        $usernameCount = $this->doctrine->getRepository(User::class)->countWithUsernamePrefix($username);
        if($usernameCount>0) $username = $username . '@' . self::generateToken(8);

        /** @var User $user */
        $user = $this->entityFactory->create(User::class);
        $user
            ->setEmail($email)
            ->setPlainPassword($password)
            ->setUsername($username);

        $this->encodePassword($user);
        $user
            ->setEnabled(true)
            ->setLastUpdate(new \DateTime());

        $this->doctrine->getManager()->persist($user);
        $this->doctrine->getManager()->flush();

        return $user;
    }

    /**
     * encode password and update salt and plain password
     * @param User $user
     */
    private function encodePassword(User $user)
    {
        $user
            ->setSalt(self::generateToken())
            ->setPassword($this->encoder->encodePassword($user, $user->getPlainPassword()))
            ->setPlainPassword(null);
    }

    /**
     * try to login, either throw an exception or return the User
     * @param string $login
     * @param string $password
     * @param Request $request
     * @param Session $session
     * @param TokenStorageInterface $tokenStorage
     * @param EventDispatcherInterface $eventDispatcher
     * @throws \Exception
     * @return User
     */
    public function login(
        string $login,
        string $password,
        Request $request,
        Session $session,
        TokenStorageInterface $tokenStorage,
        EventDispatcherInterface $eventDispatcher
    )
    {
        /** A : retrieve User */
        /** @var User $user */
        $user = $this->doctrine->getRepository(User::class)->loadUserByUsername($login);
        if($user === null) throw new \Exception("L'utilisateur <strong>". $login ."</strong> n'existe pas. <br/>Etes vous déjà inscrit ?");

        /** B : check password */
        $passwordValid = $this->encoder->isPasswordValid($user,$password);
        if(!$passwordValid) throw new \Exception("<u>Le mot de passe est invalide</u>");

        /** C : check if user is enabled */
        if(!$user->getEnabled()) throw new \Exception("L'utilisateur est actuellement <u>desactivé</u>");

        /** D : login the user ! */
        $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
        $tokenStorage->setToken($token);

        // If the firewall name is not main, then the set value would be instead:
        // $this->get('session')->set('_security_XXXFIREWALLNAMEXXX', serialize($token));
        $session->set('_security_main', serialize($token));

        // Fire the login event manually
        $event = new InteractiveLoginEvent($request, $token);
        try{$eventDispatcher->dispatch($event);}
        catch(\TypeError $e){throw new \Exception($e->getMessage());}

        $user->setLastLogin(new \DateTime());
        $this->doctrine->getManager()->flush();

        return $user;
    }



    public static function generateToken($length=32)
    {
        return rtrim(strtr(base64_encode(random_bytes($length)), '+/', '-_'), '=');
    }
}