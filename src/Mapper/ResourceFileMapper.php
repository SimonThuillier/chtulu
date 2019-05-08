<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 14/06/18
 * Time: 23:15
 */

namespace App\Mapper;


use App\DTO\EntityMutableDTO;
use App\Entity\ResourceFile;
use App\Factory\FactoryException;
use App\Factory\ResourceFileFactory;
use App\Mediator\NullColleagueException;
use Psr\Log\LoggerInterface;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ResourceFileMapper extends AbstractEntityMapper implements EntityMapperInterface
{
    /**
     * ResourceFileMapper constructor.
     *
     * @param ManagerRegistry $doctrine
     * @param ResourceFileFactory $entityFactory
     * @param LoggerInterface $logger
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(
        ManagerRegistry $doctrine,
        TokenStorageInterface $tokenStorage,
        LoggerInterface $logger,
        ResourceFileFactory $entityFactory
    )
    {
        $this->entityClassName = ResourceFile::class;
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
     * @return ResourceFile
     * @throws FactoryException
     * @throws NullColleagueException
     * @throws EntityMapperException
     */
    public function add(EntityMutableDTO $dto,$commit=true)
    {
        $this->checkAdd($dto);
        /** @var ResourceFile $file */
        $file = $this->defaultAdd($dto);

        if($commit) $this->getManager()->flush();
        return $file;
    }

    /**
     * @param EntityMutableDTO $dto
     * @param boolean $commit
     * @return ResourceFile
     * @throws EntityMapperException
     * @throws NullColleagueException
     */
    public function edit(EntityMutableDTO $dto,$commit=true)
    {
        $this->checkEdit($dto);
        /** @var ResourceFile $file */
        $file = $this->defaultEdit($dto);

        if($commit) $this->getManager()->flush();
        return $file;
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