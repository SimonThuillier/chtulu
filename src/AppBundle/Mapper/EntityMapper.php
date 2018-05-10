<?php

namespace AppBundle\Mapper;

use AppBundle\Factory\FactoryException;
use AppBundle\Mediator\DTOMediator;
use AppBundle\Mediator\InvalidCallerException;
use AppBundle\Mediator\NullColleagueException;
use Doctrine\ORM\Mapping\Entity;

/**
 * Interface MapperInterface
 *
 * @package AppBundle\Mapper
 */
interface EntityMapper
{
    /** @return DTOMediator */
    public function getMediator();

    /** @param DTOMediator $mediator
     *  @return self
     */
    public function setMediator($mediator);

    /** @param string $mediatorPassword
     *  @return self
     */
    public function setMediatorPassword($mediatorPassword);

    /**
     * @return Entity
     * @throws FactoryException
     * @throws NullColleagueException
     * @throws InvalidCallerException
     */
    public function add();

    /**
     * @param int $id
     * @return Entity
     * @throws EntityMapperException
     */
    public function find(int $id);
    /**
     * @param array $searchAttributes
     * @return mixed
     */
    public function findBy($searchAttributes);
    /**
     * @return Entity
     */
    public function findLast();

    /**
     * @param int|null $id
     * @return Entity
     * @throws EntityMapperException
     * @throws NullColleagueException
     * @throws InvalidCallerException
     */
    public function edit($id=null);

    /**
     * @param int $id
     * @return string
     */
    public function confirmDelete(int $id);

    /**
     * @param int $id
     * @throws EntityMapperException
     */
    public function delete(int $id);
}
