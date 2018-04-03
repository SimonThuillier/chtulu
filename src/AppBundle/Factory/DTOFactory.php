<?php

namespace AppBundle\Factory;

use AppBundle\DTO\EntityMutableDTO;
use AppBundle\Entity\User;
use Symfony\Bridge\Doctrine\ManagerRegistry;

abstract class DTOFactory
{
    /** @var string */
    protected $productClassName;
    /** @var ManagerRegistry */
    protected $doctrine;
    /** @var mixed $product */
    protected $product;
    /** @var User $user */
    protected $user;

    /**
     * EntityFactory constructor.
     * @param ManagerRegistry $doctrine
     */
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * @param User|null $user
     * @return EntityMutableDTO
     * @throws FactoryException
     */
    public function create($user)
    {
        if (!class_exists($this->productClassName)) {
            throw new FactoryException('Class ' . $this->productClassName . ' doesn\'t exists');
        }
        $productClassName = $this->productClassName;
        try{
            $this->product = new $productClassName();
        }
        catch(\Exception $e){
            throw new FactoryException($e->getMessage());
        }
        $this->user = $user;
        $this->setDefaultData();
        return $this->product;
    }

    /**
     * @throws FactoryException
     */
    abstract protected function setDefaultData();

}
