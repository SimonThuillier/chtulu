<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 02/07/18
 * Time: 11:55
 */

namespace AppBundle\Factory;

use AppBundle\DTO\ArticleDTO;
use AppBundle\DTO\EntityMutableDTO;
use AppBundle\DTO\ResourceDTO;
use AppBundle\DTO\ResourceGeometryDTO;
use AppBundle\DTO\ResourceImageDTO;
use AppBundle\DTO\ResourceVersionDTO;
use AppBundle\Entity\DTOMutableEntity;
use AppBundle\Helper\AssetHelper;
use AppBundle\Manager\File\FileRouter;
use AppBundle\Mediator\ArticleDTOMediator;
use AppBundle\Mediator\DTOMediator;
use AppBundle\Mediator\ResourceDTOMediator;
use AppBundle\Mediator\ResourceGeometryDTOMediator;
use AppBundle\Mediator\ResourceVersionDTOMediator;
use AppBundle\Serializer\HDateNormalizer;
use Psr\Container\ContainerInterface;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\DependencyInjection\ServiceSubscriberInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Serializer\Encoder\EncoderInterface;

class MediatorFactory implements ServiceSubscriberInterface
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
            EntityFactory::class,
            DTOFactory::class,
            ArticleDTO::class => ArticleDTOMediator::class,
            ResourceDTO::class =>  ResourceDTOMediator::class,
            ResourceVersionDTO::class => ResourceVersionDTOMediator::class,
            ResourceGeometryDTO::class => ResourceGeometryDTOMediator::class,
            HDateNormalizer::class,
            AssetHelper::class,
            MediatorFactory::class,
            FileRouter::class,
            'serializer.encoder.json' => EncoderInterface::class,
            'router' => RouterInterface::class,
            'doctrine' => ManagerRegistry::class
        ];
    }

    /**
     * @param string $className
     * @param DTOMutableEntity|null $entity
     * @param EntityMutableDTO|null $dto
     * @param int $mode
     * @return DTOMediator
     * @throws FactoryException
     */
    public function create(string $className,?DTOMutableEntity $entity=null,?EntityMutableDTO $dto=null,
                           $mode=DTOMediator::CREATE_IF_NULL)
    {
        if (!class_exists($className)) {
            throw new FactoryException('Class ' . $className . ' doesn\'t exists');
        }
        if (!$this->locator->has($className)) {
            throw new FactoryException('This factory isn\'t configured to create a ' . $className . 'Mediator');
        }


        /*if (strpos(strtoupper($className),"MEDIATOR") === false) {
            throw new FactoryException('Class ' . $className . ' isn\'t a valid mediator class');
        }*/
        /** @var DTOMediator $mediator */
        $mediatorClassName = self::getSubscribedServices()[$className];
        $mediator = new $mediatorClassName($this->locator);

        if ($entity === null && $mode === DTOMediator::CREATE_IF_NULL){
            $entity = $this->locator->get(EntityFactory::class)->create($mediator->getEntityClassName());
        }
        else if($entity === null && $mode === DTOMediator::ERROR_IF_NULL){
            throw new FactoryException('The provided Entity is null');
        }
        if ($dto === null && $entity !== null){
            $dto = $this->locator->get(DTOFactory::class)->create($mediator->getDtoClassName());
        }
        $mediator->setEntity($entity)->setDTO($dto);

        return $mediator;
    }


}