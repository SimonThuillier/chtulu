<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 14/06/18
 * Time: 23:15
 */

namespace AppBundle\Mapper;


use AppBundle\DTO\EntityMutableDTO;
use AppBundle\Entity\ResourceGeometry;
use AppBundle\Factory\FactoryException;
use AppBundle\Factory\ResourceGeometryFactory;
use AppBundle\Mediator\NullColleagueException;
use Psr\Log\LoggerInterface;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ResourceGeometryMapper extends AbstractEntityMapper implements EntityMapperInterface
{
    /**
     * ResourceGeometryMapper constructor.
     *
     * @param ManagerRegistry $doctrine
     * @param ResourceGeometryFactory $entityFactory
     * @param LoggerInterface $logger
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(
        ManagerRegistry $doctrine,
        TokenStorageInterface $tokenStorage,
        LoggerInterface $logger,
        ResourceGeometryFactory $entityFactory
    )
    {
        $this->entityClassName = ResourceGeometry::class;
        parent::__construct(
            $doctrine,
            $tokenStorage,
            $logger,
            $entityFactory
        );
    }

    /**
     * @param EntityMutableDTO $dto
     * @param boolean $commit
     * @return ResourceGeometry
     * @throws FactoryException
     * @throws NullColleagueException
     * @throws EntityMapperException
     */
    public function add(EntityMutableDTO $dto,$commit=true)
    {
        $this->checkAdd($dto);
        /** @var ResourceGeometry $geo */
        $geo = $this->defaultAdd($dto);

        if($commit) $this->getManager()->flush();
        return $geo;
    }

    /**
     * @param EntityMutableDTO $dto
     * @param boolean $commit
     * @return ResourceGeometry
     * @throws EntityMapperException
     * @throws NullColleagueException
     */
    public function edit(EntityMutableDTO $dto,$commit=true)
    {
        $this->checkEdit($dto);
        /** @var ResourceGeometry $geo */
        $geo = $this->defaultEdit($dto);

        if($commit) $this->getManager()->flush();
        return $geo;
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
            ->orderBy('o.id','DESC');
    }
}