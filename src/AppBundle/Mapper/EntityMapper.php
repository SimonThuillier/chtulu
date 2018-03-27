<?php

namespace AppBundle\Mapper;

use AppBundle\DTO\ArticleDTO;
use AppBundle\DTO\EntityMutableDTO;
use AppBundle\Factory\EntityFactory;
use AppBundle\Factory\FactoryException;
use AppBundle\Factory\PaginatorFactory;
use AppBundle\Mediator\DTOMediator;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Mapping\MappingException;
use Psr\Log\LoggerInterface;
use Symfony\Component\Form\Exception\LogicException;
use AppBundle\Entity\User;
use Doctrine\ORM\Mapping\Entity;

abstract class EntityMapper implements MapperInterface
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
        User $user = null,
        LoggerInterface $logger
    )
    {
        $this->doctrine         = $doctrine;
        $this->entityFactory    = $entityFactory;
        $this->paginatorFactory = $paginatorFactory;
        $this->currentUser      = $user;
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
     * @return mixed
     * @throws FactoryException
     */
    protected function add()
    {
        $entity = $this->mediator->getEntity();
        if($entity === null){
            $entity = $this->entityFactory->create($this->currentUser);
        }


        $this->getManager()->persist($entity);
        $this->getManager()->flush();
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
        if($id !==null){
            $this->find($id);
        }
    }

    /**
     * @return mixed
     */
    protected function edit()
    {
        $entity = $this->mediator->getEntity();
        if($entity === null){
            $entity = $this->entityFactory->create($this->currentUser);
        }
        $this->getManager()->persist($entity);
        $this->getManager()->flush();
        return $entity;
    }

    /**
     * @param integer $id
     * @throws EntityMapperException
     */
    protected function checkDelete(integer $id)
    {
        $object = $this->repository->find($id);
        if (!$object) {
            throw new EntityMapperException('impossible to find ' . $this->entityClassName . ' with id ' . $id);
        }
        $this->getManager()->remove($object);
        $this->getManager()->flush();
    }

    /**
     * @return mixed
     */
    public function findLast()
    {
        return $this->repository->findBy([], ['id' => 'DESC']);
    }

    /**
     * @param array $searchAttributes
     * @return Entity
     */
    public function findBy($searchAttributes)
    {
        return $this->repository->findBy($searchAttributes);
    }

    /**
     * @param integer $id
     * @return mixed
     * @throws EntityMapperException
     */
    public function find(integer $id)
    {
        $object = $this->repository->find($id);
        if (!$object) {
            throw new EntityMapperException('impossible to find ' . $this->entityClassName . ' with id ' . $id);
        }
        return $object;
    }
}
