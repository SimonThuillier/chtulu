<?php

namespace App\Factory;

use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

abstract class AbstractEntityFactory
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
     * @return mixed
     * @throws FactoryException
     */
    public function create()
    {
        if (!class_exists($this->productClassName)) {
            throw new FactoryException('Class ' . $this->productClassName . ' doesn\'t exists');
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
        if($this->tokenStorage->getToken() !== null){
            return $this->tokenStorage->getToken()->getUser();
        }
        return null;
    }

    /**
     * @return string
     */
    public function getProductClassName(): string
    {
        return $this->productClassName;
    }



}
