<?php

namespace AppBundle\Mapper;

use AppBundle\Factory\FactoryException;
use AppBundle\Mediator\DTOMediator;
use AppBundle\Mediator\InvalidCallerException;
use AppBundle\Mediator\NullColleagueException;
use AppBundle\Utils\SearchBag;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\QueryBuilder;

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
     * @param boolean $commit
     * @return Entity
     * @throws FactoryException
     * @throws NullColleagueException
     * @throws InvalidCallerException
     */
    public function add($commit=true);

    /**
     * @param int $id
     * @return Entity
     * @throws EntityMapperException
     */
    public function find(int $id);

    /**
     * @return QueryBuilder
     */
    public function getFindAllQB();

    /**
     * @param SearchBag|null $searchBag
     * @return integer
     */
    public function getCountBy(?SearchBag $searchBag);

    /**
     * @param SearchBag|null $searchBag
     * @param int $count
     * @return array
     */
    public function searchBy(?SearchBag $searchBag,&$count=0);
    /**
     * @return Entity
     */
    public function findLast();

    /**
     * @param int|null $id
     * @param boolean $commit
     * @return Entity
     * @throws EntityMapperException
     * @throws NullColleagueException
     * @throws InvalidCallerException
     */
    public function edit($id=null,$commit=true);

    /**
     * @param int $id
     * @return string
     */
    public function confirmDelete(int $id);

    /**
     * @param int $id
     * @param boolean $commit
     * @throws EntityMapperException
     */
    public function delete(int $id,$commit=true);
}
