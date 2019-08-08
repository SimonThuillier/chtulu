<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 27/09/18
 * Time: 23:46
 */

namespace App\Mapper;


use App\Command\EntityMapperCommand;
use App\DTO\ArticleDTO;
use App\DTO\ArticleLinkDTO;
use App\DTO\EntityMutableDTO;
use App\DTO\ResourceDTO;
use App\DTO\ResourceGeometryDTO;
use App\DTO\ResourceImageDTO;
use App\DTO\ResourceVersionDTO;
use App\Factory\FactoryException;
use App\Helper\WAOHelper;
use App\Mediator\InvalidCallerException;
use App\Mediator\NullColleagueException;
use App\Util\SearchBag;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\Mapping\Entity;
use Psr\Container\ContainerInterface;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\DependencyInjection\Exception\ServiceNotFoundException;
use Symfony\Component\DependencyInjection\ServiceSubscriberInterface;

class EntityMapper implements ServiceSubscriberInterface
{
    /** @var ManagerRegistry */
    protected $doctrine;
    /** @var ContainerInterface */
    private $locator;
    /** @var WAOHelper */
    private $waoHelper;
    /** @var SimpleEntityMapper */
    private $simpleEntityMapper;

    /**
     * EntityMapper constructor.
     * @param ManagerRegistry $doctrine
     * @param ContainerInterface $locator
     * @param WAOHelper $waoHelper
     * @param SimpleEntityMapper $simpleEntityMapper
     */
    public function __construct(
        ManagerRegistry $doctrine,
        ContainerInterface $locator,
        WAOHelper $waoHelper,
        SimpleEntityMapper $simpleEntityMapper)
    {
        $this->doctrine = $doctrine;
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
            ArticleLinkDTO::class => ArticleLinkMapper::class
        ];
    }

    /**
     * @return ObjectManager
     */
    protected function getManager()
    {
        return $this->doctrine->getManager($this->doctrine->getDefaultManagerName());
    }

    /**
     * @param string $dtoClassName
     * @return EntityMapperInterface
     * @throws InvalidCallerException
     * @throws ServiceNotFoundException
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
     * given commands from mediators execute them beginning with adds
     * @param array $mapperCommands
     * @param bool $commitEdits
     * @param array $newEntities
     * @return integer
     * @throws FactoryException
     * @throws InvalidCallerException
     * @throws NullColleagueException
     * @throws EntityMapperException
     */
    public function executeCommands(array $mapperCommands,bool $commitEdits=true,array &$newEntities=[]){
        $actionCount = 0;

        $addCommands = array_filter(array_values($mapperCommands),function(EntityMapperCommand $action){
            return $action->getAction() === EntityMapperCommand::ACTION_ADD;
        });
        usort($addCommands,function(EntityMapperCommand $action1,EntityMapperCommand $action2){
            if($action1->getPriority() === $action2->getPriority()) return 0;
            return $action1->getPriority() > $action2->getPriority()?-1:0;
        });

        $addCommands = array_reverse($addCommands);
        /**
         * @var string $key
         * @var EntityMapperCommand $action
         */
        foreach($addCommands as $key=>$action){
            $newEntities[] = $this->add($action->getDto(),true);
            $actionCount++;
        }

        $editCommands = array_reverse(array_filter(array_values($mapperCommands),function(EntityMapperCommand $action){
            return $action->getAction() === EntityMapperCommand::ACTION_EDIT;
        }));
        foreach($editCommands as $key=>$action){
            $this->edit($action->getDto(),true);
            $actionCount++;
        }

        $deleteCommands = array_reverse(array_filter(array_values($mapperCommands),function(EntityMapperCommand $action){
            return $action->getAction() === EntityMapperCommand::ACTION_DELETE;
        }));
        foreach($deleteCommands as $key=>$action){
            $this->delete($action->getDto(),true);
            $actionCount++;
        }

        return $actionCount;
    }

    public function commit(){
        $this->getManager()->flush();
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
     * @param bool $commit
     * @return Entity
     * @throws InvalidCallerException
     * @throws NullColleagueException
     * @throws EntityMapperException
     */
    public function edit(EntityMutableDTO $dto,$commit = true)
    {
        $mapper = $this->getMapperFromDtoClassName(get_class($dto));
        return $mapper->edit($dto,$commit);
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
     * @param EntityMutableDTO $dto
     * @param bool $commit
     * @throws InvalidCallerException
     * @throws EntityMapperException
     */
    public function delete(EntityMutableDTO $dto, $commit = true)
    {
        $dtoClassName=get_class($dto);
        $mapper = $this->getMapperFromDtoClassName($dtoClassName);
        $mapper->delete($dto->getId(),$commit);
    }


}