<?php
namespace AppBundle\Service;

use Doctrine\ORM\EntityManager;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\NotBlank;

/**
 * 
 * @author belze
 * service class providing functions to handle users before or after creation
 */
class UserManager
{
    private $em;
    private $validator;
    
    public function __construct(EntityManager $em)
    {
        $this->em = $em;
        $this->validator = Validation::createValidator();  // couldn't acces Validator Service here, hence this old style use
    }

    /**
     * @param string
     * function that checks if a username is valid (specific rules to define) and unused
     * TODO  define specific validation rules
     * @return boolean|string
     */
    public function isValidUsername($username){
        if($this->em->getRepository('AppBundle:User')->usernameExists($username)){
            return 'Username . \'' . $username . '\' is already used. Please choose another.';
        }
        return true;
    }
    
    /**
     * @param string
     * function that checks if an email is valid (email standard rules and unused
     * @return boolean|string
     */
    public function isValidEmail($email){
        $errors = $this->validator->validate($email, array(
            new NotBlank(array("message" => "email {{ value }} is empty.")),
            new Email(array("message" => "email {{ value }} is not a valid email address.","checkMX" => true))
        ));
        return var_dump($errors);
        
        
        if($this->em->getRepository('AppBundle:User')->emailExists($email)){
            return 'email . \'' . $email . '\' is already used. Please choose another.';
        }
        return true;
    }
    
    
    
    
}

