<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 14/06/18
 * Time: 23:15
 */

namespace AppBundle\Mapper;


use AppBundle\DTO\EntityMutableDTO;
use AppBundle\DTO\ResourceVersionDTO;
use AppBundle\Entity\ResourceVersion;
use AppBundle\Factory\FactoryException;
use AppBundle\Factory\ResourceVersionFactory;
use AppBundle\Manager\File\FileUploader;
use AppBundle\Mediator\NullColleagueException;
use Psr\Log\LoggerInterface;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ResourceVersionMapper extends AbstractEntityMapper implements EntityMapper
{
    /** @var FileUploader */
    private $uploader;

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
        ResourceVersionFactory $entityFactory,
        FileUploader $uploader
    )
    {
        $this->entityClassName = ResourceVersion::class;
        parent::__construct(
            $doctrine,
            $tokenStorage,
            $logger,
            $entityFactory
        );
        $this->uploader = $uploader;
    }

    /**
     * @param EntityMutableDTO $dto
     * @param boolean $commit
     * @return ResourceVersion
     * @throws FactoryException
     * @throws NullColleagueException
     * @throws EntityMapperException
     */
    public function add(EntityMutableDTO $dto,$commit=true)
    {
        $this->checkAdd($dto);
        /** @var ResourceVersion $version */
        $version = $this->defaultAdd($dto);
        $version->setEditionDate(new \DateTime())
            ->setEditionUser($this->getUser());

        if($version->getFile() !== null){
            $this->doctrine->getManager()->persist($version->getFile());
            try{
                /** @var ResourceVersionDTO $dto */
                $version->getFile()->setUri($this->uploader->upload($dto->getFile()));
                $dto->setFile(null);
            }
            catch(\Exception $e){
               throw new EntityMapperException("Impossible to store the uploaded file : " . $e->getMessage());
            }
        }
        if($commit) $this->getManager()->flush();
        return $version;
    }

    /**
     * @param EntityMutableDTO $dto
     * @return mixed|void
     * @throws EntityMapperException
     */
    protected function checkAdd(EntityMutableDTO $dto)
    {
        parent::checkAdd($dto);
        /** @var ResourceVersionDTO $dto */
        if($dto->getFile() === null){
            throw new EntityMapperException("Impossible to create a resource version without a file");
        }
    }

    /**
     * @param EntityMutableDTO $dto
     * @param integer|null $id
     * @param boolean $commit
     * @return ResourceVersion
     * @throws EntityMapperException
     * @throws NullColleagueException
     */
    public function edit(EntityMutableDTO $dto,$id=null,$commit=true)
    {
        $this->checkEdit($dto,$id);
        /** @var ResourceVersion $version */
        $version = $this->defaultEdit($dto,$id);

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