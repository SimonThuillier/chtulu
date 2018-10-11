<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 27/09/18
 * Time: 23:46
 */

namespace AppBundle\Mapper;


use AppBundle\DTO\ArticleDTO;
use AppBundle\DTO\EntityMutableDTO;
use AppBundle\DTO\ResourceDTO;
use AppBundle\DTO\ResourceGeometryDTO;
use AppBundle\DTO\ResourceImageDTO;
use AppBundle\DTO\ResourceVersionDTO;
use AppBundle\Factory\FactoryException;
use AppBundle\Helper\WAOHelper;
use AppBundle\Mediator\InvalidCallerException;
use AppBundle\Mediator\NullColleagueException;
use AppBundle\Utils\SearchBag;
use Doctrine\ORM\Mapping\Entity;
use Psr\Container\ContainerInterface;
use Symfony\Component\DependencyInjection\ServiceSubscriberInterface;

class EntityMapper implements ServiceSubscriberInterface
{
    /** @var ContainerInterface */
    private $locator;
    /** @var WAOHelper */
    private $waoHelper;
    /** @var SimpleEntityMapper */
    private $simpleEntityMapper;

    /**
     * EntityMapper constructor.
     * @param ContainerInterface $locator
     * @param WAOHelper $waoHelper
     * @param SimpleEntityMapper $simpleEntityMapper
     */
    public function __construct(ContainerInterface $locator,
                                WAOHelper $waoHelper,
                                SimpleEntityMapper $simpleEntityMapper)
    {
        $this->locator = $locator;
        $this->waoHelper = $waoHelper;
        $this->simpleEntityMapper = $simpleEntityMapper;
    }

    /**
     * @return array
     */
    public static function getSubscribedServices()
    {
        return [
            ArticleDTO::class => ArticleMapper::class,
            ResourceImageDTO::class => ResourceFileMapper::class,
            ResourceGeometryDTO::class => ResourceGeometryMapper::class,
            ResourceDTO::class => ResourceMapper::class,
            ResourceVersionDTO::class => ResourceVersionMapper::class,
        ];
    }

    /**
     * @param string $dtoClassName
     * @return EntityMapperInterface
     * @throws InvalidCallerException
     *
     */
    private function getMapperFromDtoClassName(string $dtoClassName){
        if($this->locator->has($dtoClassName)){
            /** @var EntityMapperInterface $mapper */
            $mapper = $this->locator->get($dtoClassName);
            return $mapper;
        }
        else{
            throw new InvalidCallerException("Mapper isn't configured for class " . $dtoClassName);
        }
    }

    /**
     * @param EntityMutableDTO $dto
     * @param bool $commit
     * @return Entity
     * @throws FactoryException
     * @throws InvalidCallerException
     * @throws NullColleagueException
     */
    public function add(EntityMutableDTO $dto, $commit = true)
    {
        $mapper = $this->getMapperFromDtoClassName(get_class($dto));
        return $mapper->add($dto,$commit);
    }

    /**
     * @param EntityMutableDTO $dto
     * @param null $id
     * @param bool $commit
     * @return Entity
     * @throws InvalidCallerException
     * @throws NullColleagueException
     * @throws EntityMapperException
     */
    public function edit(EntityMutableDTO $dto, $id = null, $commit = true)
    {
        $mapper = $this->getMapperFromDtoClassName(get_class($dto));
        return $mapper->edit($dto,$id,$commit);
    }

    /**
     * @param EntityMutableDTO $dto
     * @param null $id
     * @param bool $commit
     * @return Entity
     * @throws InvalidCallerException
     * @throws NullColleagueException
     * @throws EntityMapperException
     * @throws FactoryException
     */
    public function addOrEdit(EntityMutableDTO $dto, $id = null, $commit = true)
    {
        $mapper = $this->getMapperFromDtoClassName(get_class($dto));
        if($dto->getId() < 1){
            return $mapper->add($dto,$commit);
        }
        else{
            return $mapper->edit($dto,$dto->getId(),$commit);
        }
    }

    /**
     * @param string $dtoClassName
     * @param int $id
     * @return Entity
     * @throws InvalidCallerException
     * @throws EntityMapperException
     */
    public function find(string $dtoClassName,int $id)
    {
        if($this->waoHelper->isSimpleEntity($dtoClassName))
            return $this->simpleEntityMapper->find($dtoClassName,$id);

        $mapper = $this->getMapperFromDtoClassName($dtoClassName);
        return $mapper->find($id);
    }

    /**
     * @param string $dtoClassName
     * @return \Doctrine\ORM\QueryBuilder
     * @throws InvalidCallerException
     * @throws EntityMapperException
     */
    public function getFindAllQB(string $dtoClassName)
    {
        if($this->waoHelper->isSimpleEntity($dtoClassName))
            return $this->simpleEntityMapper->getFindAllQB($dtoClassName);

        $mapper = $this->getMapperFromDtoClassName($dtoClassName);
        return $mapper->getFindAllQB();
    }

    /**
     * @param string $dtoClassName
     * @param SearchBag|null $searchBag
     * @return int
     * @throws InvalidCallerException
     */
    public function getCountBy(string $dtoClassName,?SearchBag $searchBag)
    {
        if($this->waoHelper->isSimpleEntity($dtoClassName))
            return $this->simpleEntityMapper->getCountBy($dtoClassName,$searchBag);

        $mapper = $this->getMapperFromDtoClassName($dtoClassName);
        return $mapper->getCountBy($searchBag);
    }

    /**
     * @param string $dtoClassName
     * @param SearchBag|null $searchBag
     * @param int $count
     * @return array
     * @throws InvalidCallerException
     */
    public function searchBy(string $dtoClassName,?SearchBag $searchBag, &$count = 0)
    {
        if($this->waoHelper->isSimpleEntity($dtoClassName))
            return $this->simpleEntityMapper->searchBy($dtoClassName,$searchBag,$count);

        $mapper = $this->getMapperFromDtoClassName($dtoClassName);
        return $mapper->searchBy($searchBag,$count);
    }

    /**
     * @param string $dtoClassName
     * @return Entity
     * @throws InvalidCallerException
     * @throws EntityMapperException
     */
    public function findLast(string $dtoClassName)
    {
        if($this->waoHelper->isSimpleEntity($dtoClassName))
            return $this->simpleEntityMapper->findLast($dtoClassName);

        $mapper = $this->getMapperFromDtoClassName($dtoClassName);
        return $mapper->findLast();
    }

    /**
     * @param string $dtoClassName
     * @param int $id
     * @return string
     * @throws InvalidCallerException
     */
    public function confirmDelete(string $dtoClassName,int $id)
    {
        $mapper = $this->getMapperFromDtoClassName($dtoClassName);
        return $mapper->confirmDelete($id);
    }

    /**
     * @param string $dtoClassName
     * @param int $id
     * @param bool $commit
     * @throws InvalidCallerException
     * @throws EntityMapperException
     */
    public function delete(string $dtoClassName,int $id, $commit = true)
    {
        $mapper = $this->getMapperFromDtoClassName($dtoClassName);
        $mapper->delete($id,$commit);
    }


}