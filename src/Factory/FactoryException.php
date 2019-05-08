<?php
namespace App\Factory;

use Throwable;

/**
 * Class FactoryException
 *
 * @package Hbase\App\Exception
 */
class FactoryException extends \Exception
{
    /**
     * FactoryException constructor
     * @param string         $message
     * @param int            $code
     * @param Throwable|null $previous
     */
    public function __construct($message = "", $code = 0, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }
}
