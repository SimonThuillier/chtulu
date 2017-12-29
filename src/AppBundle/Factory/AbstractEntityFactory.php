<?php

namespace AppBundle\Factory;

use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use AppBundle\Exception\FactoryException;

abstract class AbstractEntityFactory implements EntityFactoryInterface
{
    const ENTITY_NAME_SPACE =  'AppBundle\Entity\\';

    /**
     * @param $dto
     * @return mixed
     * @throws FactoryException
     */
    public function newInstance($dto)
    {
        $entity = $this->getEntityName($dto);
        $className = self::ENTITY_NAME_SPACE . $entity;

        if (!class_exists($className)) {
            throw new \Exception('');
        }
        $entity = new $className();
        $this->setData($dto,$entity);

        return $entity;
    }

    /**
     * @param $dto
     * @param $entity
     * @throws FactoryException
     */
    abstract public function setData($dto,$entity);
    
    /**
     * 
     * @param $dto
     * @return string
     */
    private function getEntityName($dto){
        $explodedClassName = explode('\\', get_class($dto));
        $entityName = end($explodedClassName);
        $throwableTokens = ['DTO','Collection','Main','Modal'];
        foreach($throwableTokens as $token){
            $entityName = str_replace($token, '', $entityName);
        }
        return $entityName;
    }
}
