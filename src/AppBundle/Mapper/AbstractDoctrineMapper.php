<?php

namespace AppBundle\Mapper;

use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Form\Exception\LogicException;
use AppBundle\Entity\User;
use AppBundle\Factory\EntityFactoryInterface;
use AppBundle\Factory\PaginatorFactoryInterface;
use Doctrine\ORM\Mapping\Entity;

abstract class AbstractDoctrineMapper implements MapperInterface
{
    /**
     * @var ManagerRegistry
     */
    protected $doctrine;

    /**
     * @var string
     */
    protected $entityName;

    /**
     * @var EntityFactoryInterface
     */
    protected $entityFactory;

    /**
     * @var PaginatorFactoryInterface
     */
    protected $paginatorFactory;

    /**
     * @var string
     */
    protected $currentUser;

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
     * @param string $entityName
     * @param EntityFactoryInterface|null $entityFactory
     * @param PaginatorFactoryInterface|null $paginatorFactory
     * @param User $user
     */
    public function __construct(
        ManagerRegistry $doctrine,
        string $entityName,
        EntityFactoryInterface $entityFactory = null,
        PaginatorFactoryInterface $paginatorFactory = null,
        User $user = null
    )
    {
        $this->doctrine         = $doctrine;
        $this->entityName       = $entityName;
        $this->entityFactory    = $entityFactory;
        $this->paginatorFactory = $paginatorFactory;
        $this->currentUser      = $user;
    }

    /**
     * @return mixed
     */
    protected function getRepository()
    {
        return $this->getManager()->getRepository($this->entityName);
    }

    /**
     * @return mixed
     */
    public function findLast()
    {
        return $this->getRepository()->findBy([], ['id' => 'DESC']);
    }

    /**
     * @param string $attribut
     * @param string $id
     * @return Entity
     */
    public function findBy(string $attribut, string $id)
    {
        return $this->getRepository()->findBy([$attribut => $id]);
    }

    /**
     * @param string $id
     * @return mixed
     */
    public function find(string $id)
    {
        $object = $this->getRepository()->find($id);
        if (!$object) {
            throw new \LogicException(sprintf('impossible to find information for id %s', $id));
        }
        return $object;
    }

    /**
     * @param $id
     */
    public function delete($id)
    {
        /** @var Site $storage */
        $object = $this->getRepository()->find($id);
        if (!$object) {
            throw new LogicException(sprintf('impossible to find information for id %s', $id));
        }
        $this->getManager()->remove($object);
        $this->getManager()->flush();
    }
}
