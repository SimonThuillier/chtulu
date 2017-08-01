<?php
namespace AppBundle\Repository;

use Doctrine\ORM\EntityRepository;

class UserRepository extends EntityRepository
{
    /**
     * returns true if username exists, false otherwise
     * @param string $username
     * @return boolean
     */
    public function usernameExists($username){
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('count(u.id) FROM ' . $this->getEntityName() . ' u')
        ->where('u.username = :param')
        ->setParameter('param',$username);
        
        $result = $qb->getQuery()->getSingleScalarResult();
        if($result !== null && $result>0) {return true;}
        return false;
    }
    
    /**
     * returns true if email exists, false otherwise
     * @param string $email
     * @return boolean
     */
    public function emailExists($email){
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('count(u.id) FROM ' . $this->getEntityName() . ' u')
        ->where('u.email = :param')
        ->setParameter('param',$email);
        
        $result = $qb->getQuery()->getSingleScalarResult();
        if($result !== null && $result>0) {return true;}
        return false;
    }
    
    
}

