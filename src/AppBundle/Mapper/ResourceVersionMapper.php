<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 14/06/18
 * Time: 23:15
 */

namespace AppBundle\Mapper;


use AppBundle\Entity\ResourceVersion;
use AppBundle\Factory\FactoryException;
use AppBundle\Factory\PaginatorFactory;
use AppBundle\Factory\ResourceVersionFactory;
use AppBundle\Mediator\InvalidCallerException;
use AppBundle\Mediator\NullColleagueException;
use Psr\Log\LoggerInterface;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ResourceVersionMapper extends AbstractEntityMapper implements EntityMapper
{
    /**
     * ResourceVersionMapper constructor.
     *
     * @param ManagerRegistry $doctrine
     * @param ResourceVersionFactory|null $entityFactory
     * @param PaginatorFactory|null $paginatorFactory
     * @param TokenStorageInterface $tokenStorage
     * @param LoggerInterface $logger
     */
    public function __construct(
        ManagerRegistry $doctrine,
        ResourceVersionFactory $entityFactory = null,
        PaginatorFactory $paginatorFactory = null,
        TokenStorageInterface $tokenStorage,
        LoggerInterface $logger
    )
    {
        $this->entityClassName = ResourceVersion::class;
        parent::__construct(
            $doctrine,
            $entityFactory,
            $paginatorFactory,
            $tokenStorage,
            $logger);
    }

    /**
     * @param boolean $commit
     * @return ResourceVersion
     * @throws FactoryException
     * @throws NullColleagueException
     * @throws InvalidCallerException
     * @throws EntityMapperException
     */
    public function add($commit=true)
    {
        $this->checkAdd();
        /** @var ResourceVersion $version */
        $version = $this->defaultAdd();

        $this->getManager()->flush();
        //$this->mediator->getDTO()->setId($article->getId());
        return $version;
    }

    /**
     * @param integer|null $id
     * @param boolean $commit
     * @return ResourceVersion
     * @throws EntityMapperException
     * @throws NullColleagueException
     * @throws InvalidCallerException
     */
    public function edit($id=null,$commit=true)
    {
        $this->checkEdit($id);
        /** @var ResourceVersion $version */
        $version = $this->defaultEdit($id);

        $this->getManager()->flush();
        return $version;
    }


    public function confirmDelete(int $id)
    {
        return true;
    }

    /**
     * @param integer $id
     * @param boolean $commit
     * @throws EntityMapperException
     */
    public function delete(int $id,$commit=true)
    {
        $this->defaultDelete($id);
        $this->getManager()->flush();
    }

    /**
     * @inheritdoc
     */
    public function getFindAllQB()
    {
        return $this->repository->createQueryBuilder('o')
            ->select('o')
            ->orderBy('o.editionDate','DESC');
    }
}