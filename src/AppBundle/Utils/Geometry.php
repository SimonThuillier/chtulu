<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 09/09/18
 * Time: 16:11
 */

namespace AppBundle\Utils;

/** wrapper object for geometry values issued from database */
class Geometry
{
    /** @var string */
    private $value;

    /**
     * Geometry constructor.
     * @param string $value
     */
    public function __construct($value)
    {
        $this->value = $value;
        return $this;
    }

    /**
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }
}