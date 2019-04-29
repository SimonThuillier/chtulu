<?php

namespace AppBundle\Factory;

use AppBundle\DTO\EntityMutableDTO;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

abstract class AbstractDTOFactory
{
    /** @var string */
    protected $productClassName;
    /** @var ManagerRegistry */
    protected $doctrine;
    /** @var TokenStorageInterface */
    protected $tokenStorage;

    /**
     * EntityFactory constructor.
     * @param ManagerRegistry $doctrine
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(ManagerRegistry $doctrine,TokenStorageInterface $tokenStorage)
    {
        $this->doctrine = $doctrine;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * @return EntityMutableDTO
     * @throws FactoryException
     */
    public function create()
    {
        if (!class_exists($this->productClassName)) {
            throw new FactoryException('Class ' . $this->productClassName . ' doesn\'t exist');
        }
        $productClassName = $this->productClassName;
        try{
            $product = new $productClassName();
        }
        catch(\Exception $e){
            throw new FactoryException($e->getMessage());
        }
        $this->setDefaultData($product);
        return $product;
    }

    /**
     * @param mixed $product
     * @throws FactoryException
     */
    abstract protected function setDefaultData($product);

    /**
     * @return mixed
     */
    protected function getUser(){
        return $this->tokenStorage->getToken()->getUser();
    }

    /**
     * @return string
     */
    public function getProductClassName(): string
    {
        return $this->productClassName;
    }

}
