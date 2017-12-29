<?php

namespace AppBundle\Factory;

interface JsonResponseFactoryInterface
{
    public function newInstance(array $message, $status);
}
