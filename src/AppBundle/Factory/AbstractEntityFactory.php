<?php

namespace AppBundle\Factory;

use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use AppBundle\Exception\FactoryException;

abstract class AbstractEntityFactory implements EntityFactoryInterface
{
    const ENTITY_NAME_SPACE =  'AppBundle\Entity\\';

    /** @var   */
    protected $entity;

    /** @var   */
    protected $dto;

    /**
     * @param $dto
     * @return mixed
     * @throws FactoryException
     */
    public function newInstance($dto)
    {
        $entity = $this->getEntityName(get_class($dto));
        $className = self::ENTITY_NAME_SPACE . $entity;

        if (!class_exists($className)) {
            throw new FactoryException('');
        }
        $this->dto = $dto;
        $this->entity = new $className();
        $this->setData();

        return $this->entity;
    }

    abstract public function setData();
    
    /**
     * 
     * @param string $dtoClassName
     * @return string
     */
    private function getEntityName($dtoClassName){
        $entityName = end(explode('\\', get_class($dtoClassName)));
        $throwableTokens = ['DTO','Collection','Main','Modal'];
        foreach($throwableTokens as $token){
            $entityName = str_replace($token, '', $entityName);
        }
        return $entityName;
    }
}
