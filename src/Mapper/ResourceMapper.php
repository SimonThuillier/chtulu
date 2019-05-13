<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 14/06/18
 * Time: 23:25
 */

namespace App\Mapper;


use App\DTO\EntityMutableDTO;
use App\DTO\ResourceDTO;
use App\Entity\HResource;
use App\Entity\ResourceVersion;
use App\Factory\FactoryException;
use App\Factory\ResourceFactory;
use App\Mediator\NullColleagueException;
use Psr\Log\LoggerInterface;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ResourceMapper extends AbstractEntityMapper implements EntityMapperInterface
{
    /** @var ResourceVersionMapper */
    private $versionMapper;

    /**
     * ResourceMapper constructor.
     *
     * @param ManagerRegistry $doctrine
     * @param ResourceFactory $entityFactory
     * @param LoggerInterface $logger
     * @param TokenStorageInterface $tokenStorage
     * @param ResourceVersionMapper $versionMapper
     */
    public function __construct(
        ManagerRegistry $doctrine,
        TokenStorageInterface $tokenStorage,
        LoggerInterface $logger,
        ResourceFactory $entityFactory,
        ResourceVersionMapper $versionMapper
    )
    {
        $this->entityClassName = HResource::class;
        parent::__construct(
            $doctrine,
            $tokenStorage,
            $logger,
            $entityFactory
        );
        $this->versionMapper = $versionMapper;
    }

    /**
     * @param EntityMutableDTO $dto
     * @param boolean $commit
     * @return HResource
     * @throws FactoryException
     * @throws NullColleagueException
     * @throws EntityMapperException
     */
    public function add(EntityMutableDTO $dto,$commit=true)
    {
        $this->checkAdd($dto);

        /** @var ResourceDTO $dto */

        /** @var HResource $resource */
        $resource = $this->defaultAdd($dto);

        $resource->setEditionDate(new \DateTime())
            ->setEditionUser($this->getUser());

        $this->getManager()->flush();
        return $resource;
    }

    /**
     * @param EntityMutableDTO $dto
     * @return mixed|void
     * @throws EntityMapperException
     */
    protected function checkAdd(EntityMutableDTO $dto){
        parent::checkAdd($dto);
        /** @var ResourceDTO $dto */
        if($dto->getActiveVersion() === null){
            throw new EntityMapperException("Impossible to create a resource without active version of it");
        }
    }

    /**
     * @param EntityMutableDTO $dto
     * @param boolean $commit
     * @return HResource
     * @throws EntityMapperException
     * @throws NullColleagueException
     */
    public function edit(EntityMutableDTO $dto,$commit=true)
    {
        $this->checkEdit($dto);
        /** @var HResource $resource */
        $resource = $this->defaultEdit($dto);

        if($commit) $this->getManager()->flush();
        return $resource;
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
        if($commit) $this->getManager()->flush();
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