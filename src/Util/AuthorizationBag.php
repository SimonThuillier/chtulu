<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 02/02/20
 * Time: 15:10
 */

namespace App\Util;


class AuthorizationBag
{
    const READ='READ';
    const EDIT='EDIT';
    const ADMIN='ADMIN';

    /** @var array */
    private $rights;


    /**
     * AuthorizationBag constructor.
     */
    public function __construct()
    {
        $this->rights = [
            self::READ=>['allowed'=>true,'message'=>"default"],
            self::EDIT=>['allowed'=>true,'message'=>"default"],
            self::ADMIN=>['allowed'=>true,'message'=>"default"]
        ];

        return $this;
    }

    /**
     * @param string $right
     * @param bool $allowed
     * @param string $message
     * @throws \Exception
     * @return self
     */
    public function setRight(string $right,bool $allowed,string $message="default"){
        if(!in_array($right,[self::READ,self::EDIT,self::ADMIN])){
            throw new \Exception("non existent right ". $right);
        }
        $this->rights[$right] = ['allowed'=>$allowed,'message'=>$message];

        return $this;
    }

    /**
     * @param string $right
     * @return bool
     * @throws \Exception
     */
    public function isAllowed(string $right){
        if(!in_array($right,[self::READ,self::EDIT,self::ADMIN])){
            throw new \Exception("non existent right " . $right);
        }

        return $this->rights[$right]['allowed'];
    }

    /**
     * @return array
     */
    public function asArray(){
        return $this->rights;
    }


}