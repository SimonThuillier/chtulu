<?php
namespace AppBundle\Manager;

use Doctrine\ORM\EntityManager;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use AppBundle\Entity\User;
use Symfony\Component\Validator\ConstraintViolationList;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * 
 * @author belze
 * service class providing functions to handle users before or after creation
 */
class UserManager
{
    /** EntityManager $em */
    private $em;
    private $validator;
    private $encoder;
    
    public function __construct(EntityManager $em,ValidatorInterface $validator,UserPasswordEncoderInterface $encoder)
    {
        $this->em = $em;
        $this->validator = $validator;
        $this->encoder = $encoder;
    }

    /**
     * @param $username string
     * @param $email string
     * function that creates user and set automatic variables
     * if parameters are ok returns the created user, else error message
     * @return User
     */
    public function create($username="",$email=""){  
        $now = new \DateTime();
        $user = new User();
        $user->setUsername($username)
        ->setEmail($email)
        ->setCreation($now)
        ->setLastUpdate($now)
        ->setLastLogin($now)
        ->setEnabled(true); 
        
        return $user;
    }
    
    /**
     * encode password and update salt and plain password
     * @param User $user
     */
    public function encodePassword(User $user){
        $user->setSalt($this->generateSalt());
        $user->setPassword($this->encoder->encodePassword($user, $user->getPlainPassword()));
        $user->setPlainPassword(null);
    }
    
    /**
     * generate custome salt for password encoding
     * @param integer $length
     * @return string
     */
    public function generateSalt($length=15){
        $chars = str_shuffle("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" . (new \DateTime())->format('His'));
        $salt="";
        for($i=0;$i<$length;$i++){
            $salt.=substr($chars,mt_rand(0,strlen($chars)),1);
        }
        return substr(md5($salt),0,255); 
    }
    
    /**
     * @param User $user
     * @return ConstraintViolationList
     */
    public function validate($user){
        return $this->validator->validate($user);
    }
    
    
    
    
}

