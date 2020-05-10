<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 27/09/18
 * Time: 23:46
 */

namespace App\Mapper;


use App\Entity\Article;
use App\Entity\ArticleHistory;
use App\Entity\ArticleLink;
use App\Entity\DTOMutableEntity;
use App\Entity\HResource;
use App\Entity\Pop;
use App\Entity\ResourceFile;
use App\Entity\ResourceGeometry;
use App\Entity\ResourceVersion;
use App\Entity\User;
use App\Util\Command\EntityMapperCommand;
use App\Factory\FactoryException;
use App\Helper\WAOHelper;
use App\Mediator\InvalidCallerException;
use App\Mediator\NullColleagueException;
use App\Util\Command\LinkCommand;
use App\Util\SearchBag;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\Mapping\Entity;
use Psr\Container\ContainerInterface;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\DependencyInjection\Exception\ServiceNotFoundException;
use Symfony\Component\DependencyInjection\ServiceSubscriberInterface;

class EntityMapper implements ServiceSubscriberInterface
{
    public static function getEntityClassNameFromObject($object){
        return (str_replace("Proxies\__CG__\App\Entity",'App\Entity',get_class($object)));
    }

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
            Article::class => ArticleMapper::class,
            ResourceFile::class => ResourceFileMapper::class,
            ResourceGeometry::class => ResourceGeometryMapper::class,
            HResource::class => ResourceMapper::class,
            ResourceVersion::class => ResourceVersionMapper::class,
            ArticleLink::class => ArticleLinkMapper::class,
            User::class => UserMapper::class,
            ArticleHistory::class => ArticleHistoryMapper::class,
            Pop::class => PopMapper::class
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
     * executes the sequence of action in the database
     * @param array $sequence
     * @return array
     * @throws \Exception
     */
    public function executeSequence($sequence)
    {
        krsort($sequence);

        foreach($sequence as $chunk){
            /** @var EntityMapperCommand $action */
            foreach($chunk as $action){
                switch ($action->getAction()){
                    case EntityMapperCommand::ACTION_ADD:
                        $this->add($action->getEntity(),false);
                        break;
                    case EntityMapperCommand::ACTION_LINK:
                        /** @var LinkCommand $linkAction */
                        $linkAction = $action;
                        $setterName = $linkAction->getLinkerMethodName();
                        $entity = $linkAction->getEntity();
                        $entityToLink = $linkAction->getEntityToLink();
                        $entity->$setterName($entityToLink);
                        $this->edit($entity,false);
                        break;
                    case EntityMapperCommand::ACTION_EDIT:
                        $this->edit($action->getEntity(),false);
                        break;
                    case EntityMapperCommand::ACTION_DELETE:
                        $this->delete($action->getEntity(),false);
                        break;
                    default:
                        break;
                }
            }
            $this->commit();
            /** at this step all the action of this priority have been effectively done in the database */
            foreach($chunk as $action){
                $action->setDoneAt(new \DateTime());
            }
        }

        return $sequence;
    }

    /**
     * @param string $entityClassName
     * @return EntityMapperInterface
     * @throws InvalidCallerException
     * @throws ServiceNotFoundException
     */
    private function getMapperFromEntityClassName(string $entityClassName){
        if($this->locator->has($entityClassName)){
            /** @var EntityMapperInterface $mapper */
            $mapper = $this->locator->get($entityClassName);
            return $mapper;
        }
        else{
            throw new InvalidCallerException("Mapper isn't configured for class " . $entityClassName);
        }
    }

    public function commit(){
        $this->getManager()->flush();
    }

    /**
     * @param DTOMutableEntity $entity
     * @param bool $commit
     * @return Entity
     * @throws FactoryException
     * @throws InvalidCallerException
     * @throws NullColleagueException
     */
    public function add(DTOMutableEntity $entity, $commit = true)
    {
        $mapper = $this->getMapperFromEntityClassName(self::getEntityClassNameFromObject($entity));
        return $mapper->add($entity,$commit);
    }

    /**
     * @param DTOMutableEntity $entity
     * @param bool $commit
     * @return Entity
     * @throws InvalidCallerException
     * @throws NullColleagueException
     * @throws EntityMapperException
     */
    public function edit(DTOMutableEntity $entity,$commit = true)
    {
        $mapper = $this->getMapperFromEntityClassName(self::getEntityClassNameFromObject($entity));
        return $mapper->edit($entity,$commit);
    }

    /**
     * @param string $entityClassName
     * @param int $id
     * @return Entity
     * @throws InvalidCallerException
     * @throws EntityMapperException
     */
    public function find(string $entityClassName,int $id)
    {
        if($this->waoHelper->isSimpleEntity($entityClassName))
            return $this->simpleEntityMapper->find($entityClassName,$id);

        $mapper = $this->getMapperFromEntityClassName($entityClassName);
        return $mapper->find($id);
    }

    /**
     * @param string $entityClassName
     * @return \Doctrine\ORM\QueryBuilder
     * @throws InvalidCallerException
     * @throws EntityMapperException
     */
    public function getFindAllQB(string $entityClassName)
    {
        if($this->waoHelper->isSimpleEntity($entityClassName))
            return $this->simpleEntityMapper->getFindAllQB($entityClassName);

        $mapper = $this->getMapperFromEntityClassName($entityClassName);
        return $mapper->getFindAllQB();
    }

    /**
     * @param string $entityClassName
     * @param SearchBag|null $searchBag
     * @return int
     * @throws InvalidCallerException
     */
    public function getCountBy(string $entityClassName,?SearchBag $searchBag)
    {
        if($this->waoHelper->isSimpleEntity($entityClassName))
            return $this->simpleEntityMapper->getCountBy($entityClassName,$searchBag);

        $mapper = $this->getMapperFromEntityClassName($entityClassName);
        return $mapper->getCountBy($searchBag);
    }

    /**
     * @param string $entityClassName
     * @param SearchBag|null $searchBag
     * @param int $count
     * @return array
     * @throws InvalidCallerException
     */
    public function searchBy(string $entityClassName,?SearchBag $searchBag, &$count = 0)
    {
        if($this->waoHelper->isSimpleEntity($entityClassName))
            return $this->simpleEntityMapper->searchBy($entityClassName,$searchBag,$count);

        $mapper = $this->getMapperFromEntityClassName($entityClassName);
        return $mapper->searchBy($searchBag,$count);
    }

    /**
     * @param string $entityClassName
     * @return Entity
     * @throws InvalidCallerException
     * @throws EntityMapperException
     */
    public function findLast(string $entityClassName)
    {
        if($this->waoHelper->isSimpleEntity($entityClassName))
            return $this->simpleEntityMapper->findLast($entityClassName);

        $mapper = $this->getMapperFromEntityClassName($entityClassName);
        return $mapper->findLast();
    }

    /**
     * @param string $entityClassName
     * @param int $id
     * @return string
     * @throws InvalidCallerException
     */
    public function confirmDelete(string $entityClassName,int $id)
    {
        $mapper = $this->getMapperFromEntityClassName($entityClassName);
        return $mapper->confirmDelete($id);
    }

    /**
     * @param DTOMutableEntity $entity
     * @param bool $commit
     * @throws InvalidCallerException
     * @throws EntityMapperException
     */
    public function delete(DTOMutableEntity $entity, $commit = true)
    {
        $entityClassName=self::getEntityClassNameFromObject($entity);
        $mapper = $this->getMapperFromEntityClassName($entityClassName);
        $mapper->delete($entity->getId(),$commit);
    }


}