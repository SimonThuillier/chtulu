<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 02/07/18
 * Time: 11:55
 */

namespace App\Factory;

use App\DTO\ArticleDTO;
use App\DTO\ArticleHistoryDTO;
use App\DTO\ArticleLinkDTO;
use App\DTO\EntityMutableDTO;
use App\DTO\ResourceDTO;
use App\DTO\ResourceGeometryDTO;
use App\DTO\ResourceImageDTO;
use App\DTO\ResourceVersionDTO;
use App\DTO\UserDTO;
use Psr\Container\ContainerInterface;
use Symfony\Component\DependencyInjection\ServiceSubscriberInterface;

class DTOFactory implements ServiceSubscriberInterface
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
            ArticleDTO::class => ArticleDTOFactory::class,
            ResourceDTO::class =>  ResourceDTOFactory::class,
            ResourceImageDTO::class => ResourceImageDTOFactory::class,
            ResourceVersionDTO::class => ResourceVersionDTOFactory::class,
            ResourceGeometryDTO::class => ResourceGeometryDTOFactory::class,
            ArticleLinkDTO::class => ArticleLinkDTOFactory::class,
            UserDTO::class => UserDTOFactory::class,
            ArticleHistoryDTO::class => ArticleHistoryDTOFactory::class
        ];
    }

    /**
     * @param string $className
     * @return EntityMutableDTO
     * @throws FactoryException
     */
    public function create(string $className)
    {
        if (!class_exists($className)) {
            throw new FactoryException('Class ' . $className . ' doesn\'t exist');
        }
        // !array_key_exists($className,self::getSubscribedServices())
        if (!$this->locator->has($className)) {
            throw new FactoryException('This factory isn\'t configured to create a ' . $className);
        }
        /** @var AbstractEntityFactory $specializedFactory */
        $specializedFactory = $this->locator->get($className);
        /*if($specializedFactory->getProductClassName() !== $className){
            throw new FactoryException('Configuration error detected : ' . $className .
                ' is asked but ' . $specializedFactory->getProductClassName() . ' would be returned');
        }*/

        return $specializedFactory->create();
    }


}