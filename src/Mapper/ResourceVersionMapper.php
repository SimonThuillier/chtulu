<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 14/06/18
 * Time: 23:15
 */

namespace App\Mapper;


use App\Entity\DTOMutableEntity;
use App\DTO\ResourceVersionDTO;
use App\Entity\ResourceVersion;
use App\Factory\ResourceVersionFactory;
use App\Manager\File\FileUploader;
use Psr\Log\LoggerInterface;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ResourceVersionMapper extends AbstractEntityMapper implements EntityMapperInterface
{

    /**
     * ResourceVersionMapper constructor.
     *
     * @param ManagerRegistry $doctrine
     * @param ResourceVersionFactory $entityFactory
     * @param LoggerInterface $logger
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(
        ManagerRegistry $doctrine,
        TokenStorageInterface $tokenStorage,
        LoggerInterface $logger,
        ResourceVersionFactory $entityFactory
    )
    {
        $this->entityClassName = ResourceVersion::class;
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
     * @return ResourceVersion
     * @throws EntityMapperException
     */
    public function add(DTOMutableEntity $entity,$commit=true)
    {
        $this->checkAdd($entity);
        /** @var ResourceVersion $version */
        $version = $this->defaultAdd($entity);
        $version->setEditionDate(new \DateTime())
            ->setEditionUser($this->getUser());

        if($commit) $this->getManager()->flush();
        return $version;
    }

    /**
     * @param DTOMutableEntity $entity
     * @return mixed|void
     * @throws EntityMapperException
     */
    protected function checkAdd(DTOMutableEntity $entity)
    {
        parent::checkAdd($entity);
        /** @var ResourceVersionDTO $entity */
        if($entity->getFile() === null){
            throw new EntityMapperException("Impossible to create a resource version without a file");
        }
    }

    /**
     * @param DTOMutableEntity $entity
     * @param boolean $commit
     * @return ResourceVersion
     * @throws EntityMapperException
     */
    public function edit(DTOMutableEntity $entity,$commit=true)
    {
        $this->checkEdit($entity);
        /** @var ResourceVersion $version */
        $version = $this->defaultEdit($entity);

        if($commit) $this->getManager()->flush();
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