<?php

namespace AppBundle\Factory;


interface PaginatorFactoryInterface
{
    public function newInstance($query);
}