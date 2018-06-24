<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/06/18
 * Time: 22:59
 */

namespace AppBundle\Serializer;

use AppBundle\Mediator\NotAvailableGroupException;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Exception\CircularReferenceException;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;
use Symfony\Component\Serializer\Exception\LogicException;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\SerializerInterface;

abstract class HSerializer implements NormalizerInterface
{
    /** @var Serializer */
    protected $serializer;

    /**
     * JsonSerializer constructor.
     * @param array $normalizers
     */
    public function __construct(array $normalizers)
    {
        $this->serializer = new Serializer($normalizers,array(new JsonEncoder()));
    }



    abstract public function normalize($object, $format = null, array $context = array());


    abstract public function denormalize($normalizedPayload,$object=null);

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
            elseif(is_string($k) && is_array($v)){
                $normGroups["this"][] = $k;
                $normGroups[$k] = $v;
            }
            else throw new NotAvailableGroupException(
                "Groups elements must be either a string or a string referencing an array of subgroups");
        }
        return $normGroups;
    }
}