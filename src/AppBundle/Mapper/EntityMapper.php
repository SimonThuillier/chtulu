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
     * @param integer $id
     * @return Entity
     * @throws EntityMapperException
     */
    public function find(integer $id);
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
     * @param integer|null $id
     * @return Entity
     * @throws EntityMapperException
     * @throws NullColleagueException
     * @throws InvalidCallerException
     */
    public function edit($id=null);

    /**
     * @param integer $id
     * @throws EntityMapperException
     */
    public function delete(integer $id);
}
