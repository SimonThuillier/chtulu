<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 10/08/19
 * Time: 16:37
 */

namespace App\Util;

/**
 * Interface ClearableInterface
 * this interface reference actions for clearing services/objects when their use in a current controller call
 * is finished
 * it dereferences their possible buffer
 * @package App\Util
 */
interface ClearableInterface
{
    /**
     * this function must be called when all use from the service/object is done for the current controller call
     */
    public function finishAndClear();
}