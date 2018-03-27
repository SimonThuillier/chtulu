<?php

namespace AppBundle\Factory;


interface PaginatorFactoryInterface
{
    public function create($query);
}