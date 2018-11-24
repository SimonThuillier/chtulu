<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 00:53
 */

namespace AppBundle\Form\DataTransformer;

use AppBundle\Serializer\ResourceDTONormalizer;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;
use Symfony\Component\Serializer\Encoder\JsonEncoder;


/**
 * Class AbstractSimpleEntityTransformer
 * @package AppBundle\Form\DataTransformer
 */
abstract class AbstractSimpleEntityTransformer implements DataTransformerInterface
{
    protected $entityClassName=null;

    /** @var ManagerRegistry $doctrine */
    private $doctrine;


    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * @param  mixed|null $object
     * @return mixed|null
     */
    public function transform($object)
    {
        return $object;
    }

    /**
     * @param  mixed|null $payload
     * @return mixed|null
     * @throws TransformationFailedException
     * @throws \Exception
     */
    public function reverseTransform($payload)
    {
        if (null === $payload || $payload === "") return null;
        if(is_array($payload)) $payload = $payload["id"];

        return $this->doctrine->getRepository($this->entityClassName)->find(intval($payload));
    }

}