<?php

namespace AppBundle\Mapper;

use AppBundle\DTO\ArticleDTO;
use AppBundle\DTO\EntityMutableDTO;
use AppBundle\Factory\EntityFactory;
use AppBundle\Factory\FactoryException;
use AppBundle\Factory\PaginatorFactory;
use AppBundle\Mediator\DTOMediator;
use AppBundle\Mediator\InvalidCallerException;
use AppBundle\Mediator\NullColleagueException;
use AppBundle\Utils\SearchBag;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Mapping\MappingException;
use Doctrine\ORM\QueryBuilder;
use Psr\Log\LoggerInterface;
use Symfony\Component\Form\Exception\LogicException;
use AppBundle\Entity\User;
use Doctrine\ORM\Mapping\Entity;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

abstract class AbstractEntityMapper
{
    /** @var ManagerRegistry */
    protected $doctrine;
    /** @var string  */
    protected $entityClassName;
    /** @var EntityFactory */
    protected $entityFactory;
    /** @var PaginatorFactory */
    protected $paginatorFactory;
    /** @var User */
    protected $currentUser;
    /** @var LoggerInterface */
    protected $logger;
    /** @var EntityRepository */
    protected $repository;
    /** @var DTOMediator */
    protected $mediator;
    /** @var string */
    protected $mediatorPassword = null;

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
     * @param EntityFactory|null $entityFactory
     * @param PaginatorFactory|null $paginatorFactory
     * @param User $user
     */
    public function __construct(
        ManagerRegistry $doctrine,
        EntityFactory $entityFactory = null,
        PaginatorFactory $paginatorFactory = null,
        TokenStorageInterface $tokenStorage,
        LoggerInterface $logger
    )
    {
        $this->doctrine         = $doctrine;
        $this->entityFactory    = $entityFactory;
        $this->paginatorFactory = $paginatorFactory;
        $this->currentUser      = $tokenStorage->getToken()->getUser();
        $this->logger = $logger;
        $this->repository = $this->doctrine->getRepository($this->entityClassName);
    }

    /**
     * @return DTOMediator|null
     */
    public function getMediator(){
        return $this->mediator;
    }

    /**
     * @param DTOMediator|null $mediator
     * @return self
     */
    public function setMediator($mediator){
        if($mediator === $this->mediator) return;
        if($this->mediator !== null) $this->mediator->setMapper(null);
        $this->mediator = $mediator;
        if($this->mediator !== null) $this->mediator->setMapper($this);
        return $this;
    }

    /**
     * @param string $mediatorPassword
     */
    public function setMediatorPassword($mediatorPassword)
    {
        $this->mediatorPassword = $mediatorPassword;
    }

    /**
     * @return mixed
     * @throws EntityMapperException
     */
    protected function checkAdd()
    {
        if($this->mediator === null){
            throw new EntityMapperException("Mapper's mediator must be set to add an entity");
        }
        /** @var EntityMutableDTO $dto */
        $dto = $this->mediator->getDTO();
        if($dto === null){
            throw new EntityMapperException("Mediator's DTO must be set to add an entity");
        }
        if($this->mediator->getEntity() !== null && $this->mediator->getEntity()->getId()>0){
            throw new EntityMapperException("Mediator's entity already exists; please consider editing it instead");
        }
    }

    /**
     * @return Entity
     * @throws FactoryException
     * @throws NullColleagueException
     * @throws InvalidCallerException
     */
    protected function defaultAdd()
    {
        $entity = $this->mediator->getEntity();
        if($entity === null){
            $entity = $this->entityFactory->create($this->currentUser);
            $this->mediator->setEntity($entity);
        }
        $this->mediator->returnDataToEntity($this->mediatorPassword);
        $this->getManager()->persist($entity);
        return $entity;
    }

    /**
     * @param integer
     * @throws EntityMapperException
     */
    protected function checkEdit($id=null)
    {
        if($this->mediator === null){
            throw new EntityMapperException("Mapper's mediator must be set to edit an entity");
        }
        /** @var EntityMutableDTO $dto */
        $dto = $this->mediator->getDTO();
        if($dto === null){
            throw new EntityMapperException("Mediator's DTO must be set to edit an entity");
        }
        $entity = $this->mediator->getEntity();
        if($id !==null){
            $entity = $this->find($id);
        }
        if($entity === null || $entity->getId() == 0){
            throw new EntityMapperException("Entity is either null or non persisted : please consider add instead of edit");
        }
    }

    /**
     * @param int|null $id
     * @return Entity
     * @throws EntityMapperException
     * @throws NullColleagueException
     * @throws InvalidCallerException
     */
    protected function defaultEdit($id=null)
    {
        if($id !== null){
            $entity = $this->find($id);
            $this->mediator->setEntity($entity);
        }
        $entity = $this->mediator->getEntity();
        $this->mediator->returnDataToEntity($this->mediatorPassword);
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
        return $this->repository->findBy([], ['id' => 'DESC']);
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
