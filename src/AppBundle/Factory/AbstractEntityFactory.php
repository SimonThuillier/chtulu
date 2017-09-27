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
        $entity = $this->getEntityName($dto);
        $className = self::ENTITY_NAME_SPACE . $entity;

        if (!class_exists($className)) {
            throw new \Exception('');
        }
        $this->dto = $dto;
        $this->entity = new $className();
        $this->setData();

        return $this->entity;
    }

    abstract public function setData();
    
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
    
    

    /**
     * dto
     * @param $dto
     * @return self
     */
    public function setDto($dto){
        $this->dto = $dto;
        return $this;
    }

    /**
     * entity
     * @param $entity
     * @return self
     */
    public function setEntity($entity){
        $this->entity = $entity;
        return $this;
    }

}