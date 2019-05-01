<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 26/04/18
 * Time: 00:11
 */

namespace App\Validator;

use App\Utils\HDate;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;



class EndHDateSuperiorToBeginHDateValidator extends ConstraintValidator
{
    public function validate($dto, Constraint $constraint)
    {
        if($dto->getBeginHDate() !== null && $dto->getEndHDate() !== null &&
            HDate::compareHDates($dto->getBeginHDate(),$dto->getEndHDate()) > 0){
            $this->context->buildViolation($constraint->message)
                ->atPath('endHDate')
                ->addViolation();
        }
    }
}