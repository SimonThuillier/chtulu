<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/06/18
 * Time: 22:59
 */

namespace AppBundle\Serializer;

use AppBundle\Mediator\NotAvailableGroupException;
use Symfony\Component\Serializer\Exception\BadMethodCallException;
use Symfony\Component\Serializer\Exception\ExtraAttributesException;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;
use Symfony\Component\Serializer\Exception\LogicException;
use Symfony\Component\Serializer\Exception\RuntimeException;
use Symfony\Component\Serializer\Exception\UnexpectedValueException;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Serializer;

abstract class HNormalizer implements NormalizerInterface,DenormalizerInterface
{
    /** @var Serializer */
    protected $serializer;

    /**
     * JsonSerializer constructor.
     * @param array $normalizers
     */
    public function __construct(array $normalizers)
    {
        $normalizers = array_merge([new MediatorNormalizer()],$normalizers);
        $this->serializer = new Serializer($normalizers,[]);
    }

    /**
     * @param object $object
     * @param null $format
     * @param array $context
     * @return mixed
     */
    abstract public function normalize($object, $format = null, array $context = array());

    /**
     * @param mixed $data
     * @param string $class
     * @param null $format
     * @param array $context
     * @return mixed
     */
    abstract public function denormalize($data, $class, $format = null, array $context = array());


    /**
     * helper function to transform multiple depth groups allowing an in-depth serialization/deserialization
     * @param array|null $groups
     * @return array
     * @throws NotAvailableGroupException
     */
    protected function handleGroups(?array $groups){
        if($groups === null) {return ["this"=>null];}
        $normGroups = ["this"=>[]];
        foreach($groups as $k => $v){
            if(is_numeric($k)) $normGroups["this"][] = $v;
            elseif(true || (is_string($k) && is_array($v))){
                $normGroups["this"][] = $k;
                $normGroups[$k] = $v;
            }
            else throw new NotAvailableGroupException(
                "Groups elements must be either a string or a string referencing an array of subgroups");
        }
        return $normGroups;
    }
}