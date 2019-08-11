<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 14/06/18
 * Time: 23:25
 */

namespace App\Mapper;


use App\Entity\DTOMutableEntity;
use App\DTO\ResourceDTO;
use App\Entity\HResource;
use App\Factory\ResourceFactory;
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
     * @param DTOMutableEntity $entity
     * @param boolean $commit
     * @return HResource
     * @throws EntityMapperException
     */
    public function add(DTOMutableEntity $entity,$commit=true)
    {
        $this->checkAdd($entity);

        /** @var ResourceDTO $entity */

        /** @var HResource $resource */
        $resource = $this->defaultAdd($entity);

        $resource->setEditionDate(new \DateTime())
            ->setEditionUser($this->getUser());

        $this->getManager()->flush();
        return $resource;
    }

    /**
     * @param DTOMutableEntity $entity
     * @return mixed|void
     * @throws EntityMapperException
     */
    protected function checkAdd(DTOMutableEntity $entity){
        parent::checkAdd($entity);
        /** @var ResourceDTO $entity */
        // this check is deleted because usually the orchestration will be :
        // 1 : create resource and file
        // 2 : link resource version to resource and file
        // 3 : add resource version
        /*if($entity->getActiveVersion() === null){
            throw new EntityMapperException("Impossible to create a resource without active version of it");
        }*/
    }

    /**
     * @param DTOMutableEntity $entity
     * @param boolean $commit
     * @return HResource
     * @throws EntityMapperException
     */
    public function edit(DTOMutableEntity $entity,$commit=true)
    {
        $this->checkEdit($entity);
        /** @var HResource $resource */
        $resource = $this->defaultEdit($entity);

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