<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 02/07/18
 * Time: 11:55
 */

namespace AppBundle\Factory;

use AppBundle\Entity\Article;
use AppBundle\Entity\ArticleLink;
use AppBundle\Entity\DTOMutableEntity;
use AppBundle\Entity\HResource;
use AppBundle\Entity\ResourceFile;
use AppBundle\Entity\ResourceVersion;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\ServiceSubscriberInterface;

class EntityFactory implements ServiceSubscriberInterface
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
     * @return array
     */
    public static function getSubscribedServices()
    {
        return [
            Article::class => ArticleFactory::class,
            ArticleLink::class => ArticleLinkFactory::class,
            HResource::class => ResourceFactory::class,
            ResourceFile::class => ResourceFileFactory::class,
            ResourceVersion::class => ResourceVersionFactory::class
        ];
    }

    /**
     * @param string $className
     * @return DTOMutableEntity
     * @throws FactoryException
     */
    public function create(string $className)
    {
        if (!class_exists($className)) {
            throw new FactoryException('Class ' . $className . ' doesn\'t exists');
        }
        // !array_key_exists($className,self::getSubscribedServices())
        if (!array_key_exists($className,self::getSubscribedServices())) {
            throw new FactoryException('This factory isn\'t configured to create a ' . $className);
        }
        /** @var AbstractEntityFactory $specializedFactory */
        $specializedFactory = $this->locator->get(self::getSubscribedServices()[$className]);
        if($specializedFactory->getProductClassName() !== $className){
            throw new FactoryException('Configuration error detected : ' . $className .
                ' is asked but ' . $specializedFactory->getProductClassName() . ' would be returned');
        }

        return $specializedFactory->create();
    }


}