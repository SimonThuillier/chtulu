<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/06/18
 * Time: 22:59
 */

namespace App\Serializer;

use App\Helper\WAOHelper;
use App\Mediator\NotAvailableGroupException;
use App\Utils\ArrayUtil;
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
    /** @var WAOHelper */
    protected $waoHelper;

    /**
     * JsonSerializer constructor.
     * @param array $normalizers
     * @param WAOHelper $waoHelper
     */
    public function __construct(array $normalizers,WAOHelper $waoHelper)
    {
        $normalizers = array_merge([new MediatorNormalizer()],$normalizers);
        $this->serializer = new Serializer($normalizers,[]);
        $this->waoHelper = $waoHelper;
        //$this->subGroupables = [];
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
        if(array_key_exists("overGroups",$context)){
            $groups = $context["overGroups"];
            $context=[];
        }

        $upperSubGroups = ($context && array_key_exists("subGroups",$context))?$context["subGroups"]:null;
        $subGroups = [];
        $flattenGroups = $this->handleGroups($groups,$subGroups);
        if($flattenGroups == null && $context &&
            array_key_exists("currentKey",$context) &&
            array_key_exists($context["currentKey"],$upperSubGroups)
        ){
            $flattenGroups = $this->handleGroups($upperSubGroups[$context["currentKey"]],$subGroups);
        }

        $normalization = $this->serializer->normalize($object, null, array(
            'groups' => $flattenGroups, 'subGroups' => $subGroups,'currentKey' => ''
            )
        );
        return $normalization;
    }

    /**
     * @param mixed $data
     * @param string $class
     * @param null $format
     * @param array $context
     * @return array
     * @throws InvalidArgumentException
     */
    protected function defaultDenormalize($data, $class, $format = null, array $context = array())
    {
        if ($data===null) return null;

        $structure = $this->waoHelper->getDTOStructure($class,false);
        $mapping = $this->waoHelper->getDTOMapping($class);

        $groups = array_key_exists('groups',$context)?$context['groups']:null;

        // let's determine the properties to consider
        $properties = [];
        foreach($mapping as $groupName=>$groupProperties){
            foreach($groupProperties as $property){
                $properties[$property] = ($groups !== null)?(array_key_exists($groupName,$groups)?$groups[$groupName]:false):true;
            }
        }

        // make the array of properties to consider and transform them
        $preDenormalizedData = [];
        foreach($data as $property=>$value){
            if(array_key_exists($property,$properties) && $properties[$property]){
                if(array_key_exists($property,$structure)){
                    $value = $this->serializer->denormalize($value, $structure[$property]);
                }
                $preDenormalizedData[$property] = $value;
            }
        }

        if(array_key_exists('existingDto',$context)){
            $denormalization = $context['existingDto'];
            foreach($preDenormalizedData as $property=>$value){
                $function = 'set' . ucfirst($property);
                if(method_exists($denormalization,$function)){
                    $denormalization->$function($value);
                }
            }
        }
        else{
            $denormalization = $this->serializer->denormalize($data, $class, $format,$context);
        }







        return $denormalization;
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
    protected function handleGroups(?array $groups,?array &$subGroups = []){

        if (!$groups || count($groups) === 0) return null;
        $flattenGroups = ArrayUtil::flatten($groups,$subGroups);
        foreach($subGroups as $k => $v){
            if(! is_array($v) && ! is_bool($v)){
                throw new NotAvailableGroupException(
                    "Groups elements must either be a string or a string key pointing to a boolean or an array of subgroups");
            }
            /*else if(! array_key_exists($k,$this->subGroupables)){
                throw new NotAvailableGroupException(
                    "this normalizer doesn't support subgroups for group " . $k);
            }*/
        }
        return $flattenGroups;
    }

}