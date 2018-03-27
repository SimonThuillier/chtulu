<?php

namespace AppBundle\Factory;

use Doctrine\ORM\Tools\Pagination\Paginator;

class PaginatorFactory implements PaginatorFactoryInterface
{
    public function create($query)
    {
        return new Paginator($query);
    }
}
