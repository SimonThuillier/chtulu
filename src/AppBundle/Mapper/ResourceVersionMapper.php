<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 14/06/18
 * Time: 23:15
 */

namespace AppBundle\Mapper;


use AppBundle\DTO\ResourceVersionDTO;
use AppBundle\Entity\ResourceVersion;
use AppBundle\Factory\FactoryException;
use AppBundle\Factory\PaginatorFactory;
use AppBundle\Factory\ResourceVersionFactory;
use AppBundle\Manager\File\FileLocalUploader;
use AppBundle\Manager\File\FileUploader;
use AppBundle\Mediator\InvalidCallerException;
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
     * @param ResourceVersionFactory|null $entityFactory
     * @param PaginatorFactory|null $paginatorFactory
     * @param TokenStorageInterface $tokenStorage
     * @param LoggerInterface $logger
     * @param FileLocalUploader $uploader
     */
    public function __construct(
        ManagerRegistry $doctrine,
        ResourceVersionFactory $entityFactory = null,
        PaginatorFactory $paginatorFactory = null,
        TokenStorageInterface $tokenStorage,
        LoggerInterface $logger,
        FileLocalUploader $uploader
    )
    {
        $this->entityClassName = ResourceVersion::class;
        parent::__construct(
            $doctrine,
            $entityFactory,
            $paginatorFactory,
            $tokenStorage,
            $logger);
        $this->uploader = $uploader;
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
        $version->setEditionDate(new \DateTime())
            ->setEditionUser($this->currentUser);

        if($version->getFile() !== null){
            $this->doctrine->getManager()->persist($version->getFile());
            try{
                /** @var ResourceVersionDTO $versionDto */
                $versionDto = $this->mediator->getDTO();
                $version->getFile()->setUri($this->uploader->upload($versionDto->getFile()));
                $versionDto->setFile(null);
            }
            catch(\Exception $e){
               throw new EntityMapperException("Impossible to store the uploaded file : " . $e->getMessage());
            }
        }
        if($commit) $this->getManager()->flush();
        return $version;
    }

    /**
     * @return mixed|void
     * @throws EntityMapperException
     */
    protected function checkAdd()
    {
        parent::checkAdd();
        /** @var ResourceVersionDTO $dto */
        $dto = $this->mediator->getDTO();

        if($dto->getFile() === null){
            throw new EntityMapperException("Impossible to create a resource version without a file");
        }
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