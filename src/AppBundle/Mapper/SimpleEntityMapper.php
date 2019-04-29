<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 11/10/18
 * Time: 22:06
 */

namespace AppBundle\Mapper;


use AppBundle\Utils\SearchBag;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class SimpleEntityMapper
{
    /**
     * @var ManagerRegistry
     */
    private $doctrine;
    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;


    /**
     * SimpleEntityMapper constructor.
     *
     * @param ManagerRegistry $doctrine
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(
        ManagerRegistry $doctrine,
        TokenStorageInterface $tokenStorage
    )
    {
        $this->doctrine = $doctrine;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * @param string $className
     * @return EntityRepository
     * @throws EntityMapperException
     */
    private function getRepository(string $className){
        try{
            $repository = $this->doctrine->getRepository($className);
            if(!$repository) throw new \Exception("");
        }
        catch(\Exception $e){
            throw new EntityMapperException("No Repository was found for " . $className);
        }
        return $repository;
    }

    /**
     * @param string $className
     * @param int $id
     * @return mixed
     * @throws EntityMapperException
     */
    public function find(string $className,int $id)
    {
        $repository = $this->getRepository($className);
        $entity = $repository->find($id);
        if ($entity === null) {
            throw new EntityMapperException('impossible to find ' . $className . ' with id ' . $id);
        }
        return $entity;
    }

    /**
     * @param string $className
     * @return mixed
     * @throws EntityMapperException
     */
    public function findAll(string $className)
    {
        $repository = $this->getRepository($className);
        return $repository->findAll();
    }

    /**
     * @param string $className
     * @return mixed
     * @throws EntityMapperException
     */
    public function findLast(string $className)
    {
        $repository = $this->getRepository($className);
        return $repository->findBy([], ['id' => 'DESC'],1);
    }

    /**
     * @param string $className
     * @return QueryBuilder
     * @throws EntityMapperException
     */
    public function getFindAllQB(string $className)
    {
        $repository = $this->getRepository($className);

        return $repository->createQueryBuilder('o')
            ->select('o')
            ->orderBy('o.label','ASC');
    }

    /**
     * @param string $className
     * @return QueryBuilder
     * @throws EntityMapperException
     */
    protected function getCountAllQB(string $className)
    {
        $repository = $this->getRepository($className);
        return $repository->createQueryBuilder('o')
            ->select('COUNT(o.id)');
    }

    /**
     * @param string $className
     * @param QueryBuilder $qb
     * @param SearchBag $searchBag
     * @throws EntityMapperException
     */
    protected function filterBy(string $className,QueryBuilder $qb,SearchBag $searchBag)
    {
        $repository = $this->getRepository($className);

        foreach((array)($searchBag->getSearch()) as $key => $value){
            $function = 'filterBy' . str_replace('.','_',ucfirst($key));
            if(method_exists($repository,$function)){
                $repository->$function($qb,$value);
            }
            else{
                $qb->andWhere('o.'. $key . ' = ' . $value);
            }
        }
    }

    /**
     * @param string $className
     * @param QueryBuilder $qb
     * @param SearchBag $searchBag
     * @throws EntityMapperException
     */
    protected function sortBy(string $className,QueryBuilder $qb,SearchBag $searchBag)
    {
        $repository = $this->getRepository($className);

        $function = 'sortBy' . str_replace('.','_',ucfirst($searchBag->getSort()));
        if(method_exists($repository,$function)){
            $repository->$function($qb,$searchBag->getOrder());
        }
        else{
            $qb->orderBy('o.' . $searchBag->getSort(),$searchBag->getOrder());
        }
    }

    /**
     * @param string $className
     * @inheritdoc
     */
    public function getCountBy(string $className,?SearchBag $searchBag)
    {
        $countQb = $this->getCountAllQB($className);
        if($searchBag !== null){$this->filterBy($className,$countQb,$searchBag);}
        try{
            return $countQb->getQuery()->getSingleScalarResult();}
        catch(\Exception $e){return 0;}
    }

    /**
     * @param string $className
     * @inheritdoc
     */
    public function searchBy(string $className,?SearchBag $searchBag,&$count=0)
    {
        $count = $this->getCountBy($className,$searchBag);
        if($count == 0) return [];

        $qb = $this->getFindAllQB($className);

        if($searchBag !== null){
            $this->filterBy($className,$qb,$searchBag);
            $this->sortBy($className,$qb,$searchBag);
            $qb->setMaxResults($searchBag->getLimit())
                ->setFirstResult($searchBag->getOffset());
        }

        return $qb->getQuery()->getResult();
    }

}