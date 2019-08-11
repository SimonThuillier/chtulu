<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 02/07/18
 * Time: 11:55
 */

namespace App\Factory;

use App\DTO\ArticleDTO;
use App\DTO\ArticleLinkDTO;
use App\DTO\EntityMutableDTO;
use App\DTO\ResourceDTO;
use App\DTO\ResourceGeometryDTO;
use App\DTO\ResourceVersionDTO;
use App\Entity\Article;
use App\Entity\ArticleLink;
use App\Entity\DTOMutableEntity;
use App\Entity\HResource;
use App\Entity\ResourceGeometry;
use App\Entity\ResourceVersion;
use App\Helper\AssetHelper;
use App\Manager\File\FileLocalUploader;
use App\Manager\File\FileRouter;
use App\Mediator\ArticleDTOMediator;
use App\Mediator\ArticleLinkDTOMediator;
use App\Mediator\DTOMediator;
use App\Mediator\ResourceDTOMediator;
use App\Mediator\ResourceGeometryDTOMediator;
use App\Mediator\ResourceVersionDTOMediator;
use App\Observer\DBActionObserver;
use App\Serializer\HDateNormalizer;
use App\Util\ClearableInterface;
use Psr\Container\ContainerInterface;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\DependencyInjection\ServiceSubscriberInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer\Encoder\EncoderInterface;

class MediatorFactory implements ServiceSubscriberInterface,ClearableInterface
{
    /** @var ContainerInterface */
    private $locator;
    /** @var DBActionObserver */
    protected $dbActionObserver;

    private $user;
    /** @var array  */
    private $createdMediators = [];
    /** @var array  */
    private $anonymousMediators = [];

    private const MEDIATOR_SERVICES = [
        ArticleDTO::class => ArticleDTOMediator::class,
        ResourceDTO::class =>  ResourceDTOMediator::class,
        ResourceVersionDTO::class => ResourceVersionDTOMediator::class,
        ResourceGeometryDTO::class => ResourceGeometryDTOMediator::class,
        ArticleLinkDTO::class => ArticleLinkDTOMediator::class,
    ];

    private const DEFAULT_ENTITY_DTO = [
        Article::class => ArticleDTO::class,
        HResource::class =>  ResourceDTO::class,
        ResourceVersion::class => ResourceVersionDTO::class,
        ResourceGeometry::class => ResourceGeometryDTO::class,
        ArticleLink::class => ArticleLinkDTO::class,
    ];

    private const OTHER_SERVICES = [
        EntityFactory::class,
        DTOFactory::class,
        HDateNormalizer::class,
        AssetHelper::class,
        MediatorFactory::class,
        FileRouter::class,
        FileLocalUploader::class,
        'serializer.encoder.json' => EncoderInterface::class,
        'router' => RouterInterface::class,
        'doctrine' => ManagerRegistry::class
    ];

    /**
     * MediatorFactory constructor.
     * @param ContainerInterface $locator
     * @param DBActionObserver $dbActionObserver
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(
        ContainerInterface $locator,
        DBActionObserver $dbActionObserver,
        TokenStorageInterface $tokenStorage
    )
    {
        $this->locator = $locator;
        $this->dbActionObserver = $dbActionObserver;
        $this->user = $tokenStorage->getToken()->getUser();
    }


    public function finishAndClear()
    {
        foreach($this->anonymousMediators as $mediator){
            /** @var DTOMediator $mediator */
            $mediator->finishAndClear();
        }
        $this->anonymousMediators = [];

        foreach($this->createdMediators as $mediator){
            /** @var DTOMediator $mediator */
            $mediator->finishAndClear();
        }
        $this->createdMediators = [];
    }

    /**
     * @return array
     */
    public static function getSubscribedServices()
    {
        return array_merge(self::MEDIATOR_SERVICES,self::OTHER_SERVICES);
    }

    public static function getEntityClassForDTOClass($dtoClass){
        $mediatorClass = self::MEDIATOR_SERVICES[$dtoClass];
        return $mediatorClass::ENTITY_CLASS_NAME;
    }

    /**
     * @param string $className the DTO className
     * @param int|null $id original id of the DTO (which can be negative)
     * @param DTOMutableEntity|null $entity
     * @param EntityMutableDTO|null $dto
     * @param int $mode
     * @return DTOMediator
     * @throws FactoryException
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     */
    public function create(
        string $className,
        ?int $id=null,
        ?DTOMutableEntity $entity=null,
        ?EntityMutableDTO $dto=null,
        $mode=DTOMediator::CREATE_IF_NULL)
    {
        if (!class_exists($className)) {
            throw new FactoryException('Class ' . $className . ' doesn\'t exist');
        }
        if (!$this->locator->has($className)) {
            throw new FactoryException(
                'This factory isn\'t configured to create a mediator for DTO class ' . $className);
        }

        // if a mediator has already been made for this dto we return it to prevent data scattering
        if($id!==null && array_key_exists($className . ':' . $id,$this->createdMediators)){
            /** @var DTOMediator $mediator */
            $mediator = $this->createdMediators[$className . ':' . $id];
            if($dto !== null){
                if($mediator->getDTO() !== null){
                    $dto->addBackGroups($mediator->getDTO()->getBackGroups());
                }
                $mediator->setDTO($dto);
            }
            return $mediator;
        }

        /*if (strpos(strtoupper($className),"MEDIATOR") === false) {
            throw new FactoryException('Class ' . $className . ' isn\'t a valid mediator class');
        }*/
        /** @var DTOMediator $mediator */
        $mediatorClassName = self::getSubscribedServices()[$className];
        $mediator = new $mediatorClassName($this->locator,$this->dbActionObserver);

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

        if($id!==null){
            $this->createdMediators[$className . ':' . $id] = $mediator;
        }
        else{
            $this->anonymousMediators[] = $mediator;
        }

        return $mediator;
    }

    /**
     * @param string $entityClassName the Entity className
     * @param int|null $id
     * @param DTOMutableEntity|null $entity
     * @param EntityMutableDTO|null $dto
     * @param int $mode
     * @return DTOMediator
     * @throws FactoryException
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     */
    public function createWithEntityClassName(
        string $entityClassName,
        ?int $id=null,
        ?DTOMutableEntity $entity=null,
        ?EntityMutableDTO $dto=null,
        $mode=DTOMediator::CREATE_IF_NULL)
    {
        if (!array_key_exists($entityClassName,self::DEFAULT_ENTITY_DTO)) {
            throw new FactoryException(
                'This factory isn\'t configured to create a mediator for Entity class ' . $entityClassName);
        }
        $className = self::DEFAULT_ENTITY_DTO[$entityClassName];

        return $this->create(
            $className,
            $id,
            $entity,
            $dto,
            $mode
        );
    }
}