<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 14/06/18
 * Time: 23:25
 */

namespace AppBundle\Mapper;


use AppBundle\DTO\ResourceDTO;
use AppBundle\Entity\HResource;
use AppBundle\Entity\ResourceVersion;
use AppBundle\Factory\FactoryException;
use AppBundle\Factory\PaginatorFactory;

use AppBundle\Factory\ResourceFactory;
use AppBundle\Mediator\InvalidCallerException;
use AppBundle\Mediator\NullColleagueException;
use AppBundle\Mediator\ResourceVersionDTOMediator;
use Psr\Log\LoggerInterface;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ResourceMapper extends AbstractEntityMapper implements EntityMapper
{
    /** @var ResourceVersionMapper */
    private $versionMapper;


    /**
     * ResourceVersionMapper constructor.
     *
     * @param ManagerRegistry $doctrine
     * @param ResourceFactory|null $entityFactory
     * @param PaginatorFactory|null $paginatorFactory
     * @param TokenStorageInterface $tokenStorage
     * @param LoggerInterface $logger
     * @param ResourceVersionMapper $versionMapper
     */
    public function __construct(
        ManagerRegistry $doctrine,
        ResourceFactory $entityFactory = null,
        PaginatorFactory $paginatorFactory = null,
        TokenStorageInterface $tokenStorage,
        LoggerInterface $logger,
        ResourceVersionMapper $versionMapper
    )
    {
        $this->entityClassName = HResource::class;
        parent::__construct(
            $doctrine,
            $entityFactory,
            $paginatorFactory,
            $tokenStorage,
            $logger);
        $this->versionMapper = $versionMapper;
    }

    /**
     * @param boolean $commit
     * @return HResource
     * @throws FactoryException
     * @throws NullColleagueException
     * @throws InvalidCallerException
     * @throws EntityMapperException
     */
    public function add($commit=true)
    {
        $this->checkAdd();

        /** @var ResourceVersionDTOMediator $versionMediator */
        $versionMediator = $this->mediator->getDTO()->getActiveVersion()->getMediator();

        $this->versionMapper->setMediator($versionMediator);
        $this->versionMapper->add(false);
        $this->doctrine->getManager()->remove($versionMediator->getEntity());

        /** @var HResource $resource */
        $resource = $this->defaultAdd();

        $resource->setEditionDate(new \DateTime())
            ->setEditionUser($this->currentUser);

        $this->getManager()->flush();
        /** @var ResourceVersion $version */
        $version = $versionMediator->getEntity();
        $version
            ->setResource($resource)
            ->setNumber(1);
        $this->versionMapper->add(true);
        //$this->mediator->getDTO()->setId($article->getId());
        return $resource;
    }

    /**
     * @return mixed|void
     * @throws EntityMapperException
     */
    protected function checkAdd(){
        parent::checkAdd();
        /** @var ResourceDTO $dto */
        $dto = $this->mediator->getDTO();

        if($dto->getActiveVersion() === null){
            throw new EntityMapperException("Impossible to create a resource without an active version");
        }
    }

    /**
     * @param integer|null $id
     * @param boolean $commit
     * @return HResource
     * @throws EntityMapperException
     * @throws NullColleagueException
     * @throws InvalidCallerException
     */
    public function edit($id=null,$commit=true)
    {
        $this->checkEdit($id);
        /** @var HResource $resource */
        $resource = $this->defaultEdit($id);

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