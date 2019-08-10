<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 14/06/18
 * Time: 23:15
 */

namespace App\Mapper;


use App\Entity\DTOMutableEntity;
use App\Entity\ResourceGeometry;
use App\Factory\ResourceGeometryFactory;
use Psr\Log\LoggerInterface;
use Doctrine\Common\Persistence\ManagerRegistry;
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
     * @param DTOMutableEntity $entity
     * @param boolean $commit
     * @return ResourceGeometry
     * @throws EntityMapperException
     */
    public function add(DTOMutableEntity $entity,$commit=true)
    {
        $this->checkAdd($entity);
        /** @var ResourceGeometry $geo */
        $geo = $this->defaultAdd($entity);

        if($commit){
            $this->getManager()->flush();
        }
        return $geo;
    }

    /**
     * @param DTOMutableEntity $entity
     * @param boolean $commit
     * @return ResourceGeometry
     * @throws EntityMapperException
     */
    public function edit(DTOMutableEntity $entity,$commit=true)
    {
        $this->checkEdit($entity);
        /** @var ResourceGeometry $geo */
        $geo = $this->defaultEdit($entity);

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