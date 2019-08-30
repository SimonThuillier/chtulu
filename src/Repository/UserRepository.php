<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, User::class);
    }

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

    // /**
    //  * @return User[] Returns an array of User objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
