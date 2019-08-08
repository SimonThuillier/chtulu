<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/06/18
 * Time: 22:59
 */

namespace App\Serializer;

use App\Factory\MediatorFactory;
use App\Helper\WAOHelper;
use App\Mediator\DTOMediator;
use App\Mediator\NotAvailableGroupException;
use App\Util\ArrayUtil;
use Doctrine\Common\Persistence\ManagerRegistry;
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
    /** @var ManagerRegistry */
    protected $doctrine;
    /** @var MediatorFactory */
    protected $mediatorFactory;


    /**
     * JsonSerializer constructor.
     * @param array $normalizers
     * @param WAOHelper $waoHelper
     * @param ManagerRegistry $doctrine
     * @param MediatorFactory $mediatorFactory
     */
    public function __construct(array $normalizers,
                                WAOHelper $waoHelper,
                                ManagerRegistry $doctrine,
                                MediatorFactory $mediatorFactory)
    {
        $normalizers = array_merge([new MediatorNormalizer()],$normalizers);
        $this->serializer = new Serializer($normalizers,[]);
        $this->waoHelper = $waoHelper;
        $this->doctrine = $doctrine;
        $this->mediatorFactory = $mediatorFactory;
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
            //if($subGroups===null || !is_array($subGroups)){$subGroups = [];}
            if(is_array($upperSubGroups[$context["currentKey"]])){
                $flattenGroups = $this->handleGroups($upperSubGroups[$context["currentKey"]],$subGroups);
            }
            else{
                $flattenGroups = ['minimal'];
            }
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
                // for links reasons we always take id !
                $properties[$property] = ($property!=='id' && ($groups !== null && is_array($groups)))?(array_key_exists($groupName,$groups)?$groups[$groupName]:false):true;
            }
        }

        // make the array of properties to consider and transform them
        $preDenormalizedData = [];
        foreach($data as $property=>$value){
            if(array_key_exists($property,$properties) && $properties[$property]){
                if(array_key_exists($property,$structure)){
                    $subGroups = ($groups !== null && is_array($groups) && array_key_exists($property,$groups))?$groups[$property]:[];
                    $value = $this->serializer->denormalize($value, $structure[$property],null,['groups'=>$subGroups]);
                }
                $preDenormalizedData[$property] = $value;
            }
        }

        // instanciation of the denormalization which should be a DTO (with an id)
        $denormalization = null;
        if(array_key_exists('existingDto',$context)){
            $denormalization = $context['existingDto'];
        }
        else if(array_key_exists("id",$preDenormalizedData)){
            $id = intval($data["id"]);
            if(!$id) return null;
            $entity = null;
            $className = MediatorFactory::getEntityClassForDTOClass($class);
            if($id > 0){
                $entity = $this->doctrine->getRepository($className)->find($id);
                if(!$entity) return null; // the id doesn't exist => we do nothing else
            }
            $mediator = $this->mediatorFactory->create($class,$entity);
            $mediator->mapDTOGroups(is_array($groups)?$groups:null,DTOMediator::CREATE_IF_NULL);
            $denormalization = $mediator->getDTO();
        }

        if($denormalization === null) return null;
        // else we finally use the set method to inject data in our regular DTO
        foreach($preDenormalizedData as $property=>$value){
            $function = 'set' . ucfirst($property);
            if(method_exists($denormalization,$function)){
                $denormalization->$function($value);
            }
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