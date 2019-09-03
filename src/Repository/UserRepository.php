<?php

namespace App\Repository;


use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;

class UserRepository extends EntityRepository implements UserLoaderInterface
{
    public function loadUserByUsername($username)
    {
        return $this->createQueryBuilder('u')
            ->where('u.username = :username OR u.email = :email')
            ->setParameter('username', $username)
            ->setParameter('email', $username)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * returns count of all users with username beginning by the parameter, 0 if none exists
     * @param string $username
     * @return int
     */
    public function countWithUsernamePrefix($username)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('count(u.id) FROM ' . $this->getEntityName() . ' u')
            ->where($qb->expr()->eq('u.username',$qb->expr()->literal($username)))
            ->orWhere($qb->expr()->like('u.username',$qb->expr()->literal($username . '|%')));

        try{$result = $qb->getQuery()->getSingleScalarResult();}
        catch(\Exception $e){return 0;}

        if($result !== null ) return intval($result);
        return 0;
    }

    /**
     * returns true if user with this email exists, false otherwise
     * @param string $email
     * @return boolean
     */
    public function emailExists($email)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('count(u.id) FROM ' . $this->getEntityName() . ' u')
            ->where('u.email = :param')
            ->setParameter('param',$email);

        try{$result = $qb->getQuery()->getSingleScalarResult();}
        catch(\Exception $e){return false;}
        if($result !== null && $result>0) {return true;}
        return false;
    }

    /**
     * returns true if another user with this username exists, false otherwise
     * @param int $id of our user
     * @param string $username
     * @return boolean
     */
    public function otherUserWithUsernameExists($id,$username)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('count(u.id) FROM ' . $this->getEntityName() . ' u')
            ->where('u.username = :username')
            ->andWhere($qb->expr()->not('u.id = :id'))
            ->setParameter('username',$username)
            ->setParameter('id',$id);

        try{$result = $qb->getQuery()->getSingleScalarResult();}
        catch(\Exception $e){
            return true;
        }
        if($result !== null && $result>0) {return true;}
        return false;
    }
}
