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
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Mapping\MappingException;
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
     */
    public function setMediator($mediator){
        if($mediator === $this->mediator) return;
        if($this->mediator !== null) $this->mediator->setMapper(null);
        $this->mediator = $mediator;
        if($this->mediator !== null) $this->mediator->setMapper($this);
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
     * @param integer|null $id
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
     * @param integer $id
     * @throws EntityMapperException
     */
    protected function checkDelete(integer $id)
    {
        $this->find($id);
    }

    /**
     * @param integer $id
     * @throws EntityMapperException
     */
    protected function defaultDelete(integer $id)
    {
        $entity = $this->find($id);
        $this->getManager()->remove($entity);
    }

    /**
     * @param integer $id
     * @return Entity
     * @throws EntityMapperException
     */
    public function find(integer $id)
    {
        $entity = $this->repository->find($id);
        if ($entity === null) {
            throw new EntityMapperException('impossible to find ' . $this->entityClassName . ' with id ' . $id);
        }
        return $entity;
    }

    /**
     * @param array $searchAttributes
     * @return mixed
     */
    public function findBy($searchAttributes)
    {
        return $this->repository->findBy($searchAttributes);
    }

    /**
     * @return Entity
     */
    public function findLast()
    {
        return $this->repository->findBy([], ['id' => 'DESC']);
    }
}
