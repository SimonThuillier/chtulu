<?php

namespace AppBundle\Factory;

interface EntityFactoryInterface
{
    public function newInstance($dto);
}
