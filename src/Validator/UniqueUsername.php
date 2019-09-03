<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 26/04/18
 * Time: 00:06
 */

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class UniqueUsername extends Constraint
{
    public $message = "Ce nom d'utilisateur est déjà pris : choisissez-en un autre !";

    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}