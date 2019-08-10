<?php

namespace App\Mapper;

use App\Entity\DTOMutableEntity;
use App\Factory\FactoryException;
use App\Mediator\InvalidCallerException;
use App\Mediator\NullColleagueException;
use App\Util\SearchBag;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\QueryBuilder;

/**
 * Interface MapperInterface
 *
 * @package App\Mapper
 */
interface EntityMapperInterface
{
    /**
     * @param DTOMutableEntity $entity
     * @param boolean $commit
     * @return Entity
     * @throws FactoryException
     * @throws NullColleagueException
     * @throws InvalidCallerException
     */
    public function add(DTOMutableEntity $entity,$commit=true);

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
     * @param DTOMutableEntity $entity
     * @param boolean $commit
     * @return Entity
     * @throws EntityMapperException
     * @throws NullColleagueException
     * @throws InvalidCallerException
     */
    public function edit(DTOMutableEntity $entity,$commit=true);

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
