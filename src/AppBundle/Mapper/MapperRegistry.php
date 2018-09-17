<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 17/09/18
 * Time: 23:10
 */

namespace AppBundle\Mapper;


use AppBundle\Entity\Article;
use AppBundle\Entity\HResource;
use AppBundle\Entity\ResourceFile;
use AppBundle\Entity\ResourceGeometry;
use AppBundle\Entity\ResourceVersion;
use Psr\Container\ContainerInterface;
use Symfony\Component\DependencyInjection\ServiceSubscriberInterface;

class MapperRegistry implements ServiceSubscriberInterface
{
    /** @var ContainerInterface */
    private $locator;

    /**
     * EntityFactory constructor.
     * @param ContainerInterface $locator
     */
    public function __construct(ContainerInterface $locator)
    {
        $this->locator = $locator;
    }

    /**
     * @param string $className
     * @return EntityMapper
     * @throws \Exception
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     */
    public function getMapper(string $className)
    {
        if (!class_exists($className)) {
            throw new \Exception('Class ' . $className . ' doesn\'t exists');
        }
        else if (!$this->locator->has($className)) {
            throw new \Exception('Class ' . $className . ' isn\'t handled by this MapperRegistry');
        }

        return $this->locator->get($className);
    }

    /**
     * @param string $mediatorClassName
     * @return EntityMapper
     * @throws \Exception
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     */
    public function getMapperByMediator(string $mediatorClassName)
    {
        if (!class_exists($mediatorClassName)) {
            throw new \Exception('Class ' . $mediatorClassName . ' doesn\'t exists');
        }
        var_dump($mediatorClassName);
        $entityClassName = (get_class_vars($mediatorClassName))["ENTITY_CLASS_NAME"];
        return $this->getMapper($entityClassName);
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
        ];
    }

}