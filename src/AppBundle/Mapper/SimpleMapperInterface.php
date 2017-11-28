<?php

namespace AppBundle\Mapper;

/**
 * Interface SimpleMapperInterface
 * SimpleMappers are designed to inject content of a small input object to a big output object
 * They are invertible
 * @package AppBundle\Mapper
 */
interface SimpleMapperInterface
{
    /**
     * @param mixed $inputObject
     * @param mixed $outputObject
     * @param string|null $prefix
     */
    static function map($inputObject,$outputObject,$prefix='');
    
    /**
     * @param mixed $inputObject
     * @param mixed $outputObject
     * @param string|null $prefix
     */
    static function iMap($inputObject,$outputObject,$prefix='');
}
