<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 26/04/18
 * Time: 00:06
 */

namespace AppBundle\Validator;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class EndHDateSuperiorToBeginHDate extends Constraint
{
    public $message = 'La date de fin doit être supérieure à la date de début';

    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}