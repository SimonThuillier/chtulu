<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 02/07/18
 * Time: 11:55
 */

namespace AppBundle\Factory;

use AppBundle\DTO\EntityMutableDTO;
use AppBundle\Entity\DTOMutableEntity;
use AppBundle\Mediator\DTOMediator;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\ServiceSubscriberInterface;

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
            DTOFactory::class
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
        if (strpos(strtoupper($className),"MEDIATOR") === false) {
            throw new FactoryException('Class ' . $className . ' isn\'t a valid mediator class');
        }
        /** @var DTOMediator $mediator */
        $mediator = new $className($this->locator);

        if ($entity === null && $mode === DTOMediator::CREATE_IF_NULL){
            $entity = $this->locator->get(EntityFactory::class)->create($mediator->getEntityClassName());
        }
        else if($entity === null && $mode === DTOMediator::ERROR_IF_NULL){
            throw new FactoryException('The provided Entity is null');
        }
        if ($dto === null && $entity !== null){
            $dto = $this->locator->get(DtoFactory::class)->create($mediator->getDtoClassName());
        }
        $mediator->setEntity($entity)->setDTO($dto);

        return $mediator;
    }


}