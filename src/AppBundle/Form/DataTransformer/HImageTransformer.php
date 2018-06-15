<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 00:53
 */

namespace AppBundle\Form\DataTransformer;

use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;


class HImageTransformer implements DataTransformerInterface
{

    public function __construct()
    {
    }

    /**
     * @param  mixed|null $object
     * @return mixed|null
     * @throws TransformationFailedException
     */
    public function transform($object)
    {
        return $object;
    }

    /**
     * @param  mixed|null $payload
     * @return mixed|null
     * @throws TransformationFailedException
     */
    public function reverseTransform($payload)
    {
        return $payload;
    }

}