<?php

namespace AppBundle\Factory;

use Doctrine\ORM\Tools\Pagination\Paginator;

class PaginatorFactory implements PaginatorFactoryInterface
{
    public function newInstance($query)
    {
        return new Paginator($query);
    }
}
