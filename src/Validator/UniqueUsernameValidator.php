<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 26/04/18
 * Time: 00:11
 */

namespace App\Validator;

use App\DTO\UserDTO;
use App\Entity\User;
use App\Util\HDate;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;



class UniqueUsernameValidator extends ConstraintValidator
{
    /** ManagerRegistry $em */
    private $doctrine;

    public function __construct(
        ManagerRegistry $doctrine
    )
    {
        $this->doctrine = $doctrine;
    }


    public function validate($dto, Constraint $constraint)
    {
        /** @var UserDTO $dto */
        if($this->doctrine->getRepository(User::class)
            ->otherUserWithUsernameExists($dto->getId(),$dto->getUsername()))
        {
            $this->context->buildViolation($constraint->message)
                ->atPath("username")
                ->addViolation();
        }
    }
}