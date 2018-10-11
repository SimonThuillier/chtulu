<?php

namespace AppBundle\Mapper;

use AppBundle\DTO\EntityMutableDTO;
use AppBundle\Factory\AbstractEntityFactory;
use AppBundle\Factory\FactoryException;
use AppBundle\Mediator\NullColleagueException;
use AppBundle\Utils\SearchBag;
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
    /** @var string  */
    protected $dtoClassName;
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
     * @param EntityMutableDTO $dto
     * @return mixed
     * @throws EntityMapperException
     */
    protected function checkAdd(EntityMutableDTO $dto)
    {
        if($dto->getMediator() === null){
            throw new EntityMapperException("Dto's mediator must be set to add an entity");
        }
        if($dto->getMediator()->getEntity() !== null && $dto->getMediator()->getEntity()->getId()>0){
            throw new EntityMapperException("Mediator's entity already exists; please consider editing it instead");
        }
    }

    /**
     * @param EntityMutableDTO $dto
     * @return Entity
     * @throws FactoryException
     * @throws NullColleagueException
     */
    protected function defaultAdd(EntityMutableDTO $dto)
    {
        $mediator = $dto->getMediator();
        $entity = $mediator->getEntity();
        if($entity === null){
            $entity = $this->entityFactory->create($this->tokenStorage->getToken()->getUser());
            $mediator->setEntity($entity);
        }
        $mediator->returnDataToEntity();
        $this->getManager()->persist($entity);
        return $entity;
    }

    /**
     * @param EntityMutableDTO $dto
     * @param integer|null $id
     * @throws EntityMapperException
     */
    protected function checkEdit(EntityMutableDTO $dto,$id=null)
    {
        if($dto->getMediator() === null){
            throw new EntityMapperException("Mapper's mediator must be set to edit an entity");
        }
        $entity = $dto->getMediator()->getEntity();
        if($id !==null){$entity = $this->find($id);}
        if($entity === null || $entity->getId() == 0){
            throw new EntityMapperException("Entity is either null or non persisted : please consider add instead of edit");
        }
    }

    /**
     * @param EntityMutableDTO $dto
     * @param int|null $id
     * @return Entity
     * @throws EntityMapperException
     * @throws NullColleagueException
     */
    protected function defaultEdit(EntityMutableDTO $dto,$id=null)
    {
        $entity = $dto->getMediator()->getEntity();
        if($id !== null){
            $entity = $this->find($id);
            $dto->getMediator()->setEntity($entity);
        }
        $dto->getMediator()->returnDataToEntity();
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
        foreach((array)($searchBag->getSearch()) as $key => $value){
            $function = 'filterBy' . str_replace('.','_',ucfirst($key));
            if(method_exists($this->repository,$function)){
                $this->repository->$function($qb,$value);
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
            return $countQb->getQuery()->getSingleScalarResult();}
        catch(\Exception $e){return 0;}
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

        return $qb->getQuery()->getResult();
    }
}
