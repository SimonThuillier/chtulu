<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/06/18
 * Time: 22:59
 */

namespace AppBundle\Serializer;

use AppBundle\Mediator\NotAvailableGroupException;
use AppBundle\Utils\ArrayUtil;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Serializer;

abstract class HNormalizer implements NormalizerInterface,DenormalizerInterface
{
    /** @var Serializer */
    protected $serializer;
    /** @var array */
    protected $subGroupables;
    /** @var ?array */
    protected $preDefinedGroups;

    /**
     * JsonSerializer constructor.
     * @param array $normalizers
     */
    public function __construct(array $normalizers)
    {
        $normalizers = array_merge([new MediatorNormalizer()],$normalizers);
        $this->serializer = new Serializer($normalizers,[]);
        $this->subGroupables = [];
    }

    /**
     * @param mixed $object
     * @param array|null $groups
     * @param array $context
     * @return array
     * @throws InvalidArgumentException
     * @throws NotAvailableGroupException
     */
    protected function defaultNormalize($object,$groups=null,array $context=[])
    {
        $flattenGroups = $this->handleGroups($groups);
        $normalization = $this->serializer->normalize($object, null, array('groups' => $flattenGroups));
        $this->setPreDefinedGroups(null);
        return $normalization;
    }

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
     * @param array $subGroups
     * @return array
     * @throws NotAvailableGroupException
     */
    protected function handleGroups(?array $groups,$subGroups = []){
        if (!$groups) return $this->preDefinedGroups;
        if(!$subGroups) $subGroups = [];
        $flattenGroups = ArrayUtil::flatten($groups,$subGroups);
        foreach($subGroups as $k => $v){
            if(! is_array($v)){
                throw new NotAvailableGroupException(
                    "Groups elements must either be a string or a string key referencing an array of subgroups");
            }
            else if(! array_key_exists($k,$this->subGroupables)){
                throw new NotAvailableGroupException(
                    "this normalizer doesn't support subgroups for group " . $k);
            }
            /** @var HNormalizer $subNormalizer */
            $subNormalizer = $this->subGroupables[$k];
            $subNormalizer->setPreDefinedGroups($v);
        }

        return $flattenGroups;
    }

    protected function setPreDefinedGroups(?array $groups){
        $this->preDefinedGroups = $groups;
    }
}