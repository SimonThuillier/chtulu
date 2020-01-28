<?php

namespace App\Mapper;

use App\Entity\DTOMutableEntity;
use App\Factory\AbstractEntityFactory;
use App\Util\SearchBag;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\Mapping\Entity;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

abstract class AbstractEntityMapper
{
    /** @var ManagerRegistry */
    protected $doctrine;
    /** @var string  */
    protected $entityClassName;
    /** @var AbstractEntityFactory */
    protected $entityFactory;
    /** @var EntityRepository */
    protected $repository;
    /** @var LoggerInterface */
    protected $logger;
    /** @var TokenStorageInterface */
    protected $tokenStorage;

    /**
     * @return ObjectManager
     */
    protected function getManager()
    {
        return $this->doctrine->getManager($this->doctrine->getDefaultManagerName());
    }

    /**
     * AbstractDoctrineMapper constructor.
     *
     * @param ManagerRegistry $doctrine
     * @param AbstractEntityFactory $entityFactory
     * @param LoggerInterface $logger
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(
        ManagerRegistry $doctrine,
        TokenStorageInterface $tokenStorage,
        LoggerInterface $logger,
        AbstractEntityFactory $entityFactory
    )
    {
        $this->doctrine         = $doctrine;
        $this->tokenStorage     = $tokenStorage;
        $this->logger = $logger;
        $this->entityFactory    = $entityFactory;
        $this->repository = $this->doctrine->getRepository($this->entityClassName);
    }

    /**
     * @return mixed
     */
    protected function getUser(){
        return $this->tokenStorage->getToken()->getUser();
    }

    /**
     * @param DTOMutableEntity $entity
     * @return mixed
     * @throws EntityMapperException
     */
    protected function checkAdd(DTOMutableEntity $entity)
    {
        $id = $entity->getId();
        if($id !== null && $id>0){
            throw new EntityMapperException("Mediator's entity already exists; please consider editing it instead");
        }
    }

    /**
     * @param DTOMutableEntity $entity
     * @return DTOMutableEntity
     */
    protected function defaultAdd(DTOMutableEntity $entity)
    {
        $this->getManager()->persist($entity);
        return $entity;
    }

    /**
     * @param DTOMutableEntity $entity
     * @throws EntityMapperException
     */
    protected function checkEdit(DTOMutableEntity $entity)
    {
        /*$id = $entity->getId();
        if($entity === null || $id === null|| $id == 0){
            throw new EntityMapperException(
                "Entity is either null or non persisted : please consider add instead of edit");
        }*/
    }

    /**
     * @param DTOMutableEntity $entity
     * @return DTOMutableEntity
     */
    protected function defaultEdit(DTOMutableEntity $entity)
    {
        return $entity;
    }

    /**
     * @param int $id
     * @throws EntityMapperException
     */
    protected function checkDelete(int $id)
    {
        $this->find($id);
    }

    /**
     * @param int $id
     * @throws EntityMapperException
     */
    protected function defaultDelete(int $id)
    {
        $entity = $this->find($id);
        $this->getManager()->remove($entity);
    }

    /**
     * @param int $id
     * @return Entity
     * @throws EntityMapperException
     */
    public function find(int $id)
    {
        $entity = $this->repository->find($id);
        if ($entity === null) {
            throw new EntityMapperException('impossible to find ' . $this->entityClassName . ' with id ' . $id);
        }
        return $entity;
    }

    /**
     * @return mixed
     */
    public function findAll()
    {
        return $this->repository->findAll();
    }

    /**
     * @return Entity
     */
    public function findLast()
    {
        return $this->repository->findBy([], ['id' => 'DESC'],1);
    }

    /**
     * @return QueryBuilder
     */
    abstract public function getFindAllQB();

    /**
     * produces a search part of the searchbag complient with repository filter requirements
     * @param $search
     * @return mixed
     */
    protected function getTransformedSearch($search){
        return $search;
    }

    /**
     * @return QueryBuilder
     */
    protected function getCountAllQB(){
        return $this->repository->createQueryBuilder('o')
            ->select('COUNT(o.id)');
    }

    /**
     * @param QueryBuilder $qb
     * @param SearchBag $searchBag
     */
    protected function filterBy(QueryBuilder $qb,SearchBag $searchBag){
        $search = $this->getTransformedSearch($searchBag->getSearch());

        foreach((array)($search) as $key => $value){
            $function = 'filterBy' . str_replace('.','_',ucfirst($key));
            if(method_exists($this->repository,$function)){
                $this->repository->$function($qb,$value,$searchBag->getLimit());
            }
            else{
                $qb->andWhere('o.'. $key . ' = ' . $value);
            }
        }
    }

    /**
     * @param QueryBuilder $qb
     * @param SearchBag $searchBag
     */
    protected function sortBy(QueryBuilder $qb,SearchBag $searchBag){
        $function = 'sortBy' . str_replace('.','_',ucfirst($searchBag->getSort()));
        if(method_exists($this->repository,$function)){
            $this->repository->$function($qb,$searchBag->getOrder());
        }
        else{
            $qb->orderBy('o.' . $searchBag->getSort(),$searchBag->getOrder());
        }
    }

    /**
     * @inheritdoc
     */
    public function getCountBy(?SearchBag $searchBag)
    {
        $countQb = $this->getCountAllQB();
        if($searchBag !== null){$this->filterBy($countQb,$searchBag);}
        try{
            $truc = $countQb->getQuery();
            $truc2 = $truc->getSQL();
            return $countQb->getQuery()->getSingleScalarResult();}
        catch(\Exception $e){
            return 0;
        }
    }

    /**
     * @inheritdoc
     */
    public function searchBy(?SearchBag $searchBag,&$count=0)
    {
        $count = $this->getCountBy($searchBag);
        if($count == 0) return [];

        $qb = $this->getFindAllQB();

        if($searchBag !== null){
            $this->filterBy($qb,$searchBag);
            $this->sortBy($qb,$searchBag);
            $qb->setMaxResults($searchBag->getLimit())
                ->setFirstResult($searchBag->getOffset());
        }

        $truc = $qb->getQuery();
        $truc2 = $truc->getSQL();

        return $this->postProcessResult($qb->getQuery()->getResult(),$searchBag);
    }

    /**
     * can perform various actions on the result after query 's completed
     * @param mixed $result
     * @param SearchBag|null $searchBag
     * @return mixed
     */
    protected function postProcessResult($result,?SearchBag $searchBag){
        if(!$searchBag) return $result;
        $search = $this->getTransformedSearch($searchBag->getSearch());

        foreach((array)($search) as $key => $value){
            if($key ==='keyword'){
                if(method_exists($this->repository,'postProcessResultByKeyword')){
                    $result = $this->repository->postProcessResultByKeyword($result,$value);
                }
            }
        }

        return $result;
    }
}
