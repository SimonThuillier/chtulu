<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 07/04/18
 * Time: 20:05
 */

namespace AppBundle\Serializer;

use AppBundle\DTO\ResourceDTO;
use AppBundle\Mediator\NotAvailableGroupException;
use Doctrine\Common\Annotations\AnnotationReader;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\PropertyNormalizer;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;
use Symfony\Component\Serializer\Serializer;


class ResourceDTONormalizer extends HNormalizer implements NormalizerInterface
{
    /** @var ResourceVersionDTONormalizer */
    private $versionDtoNormalizer;
    /** @var array */
    private $customCallbackParams;

    /**
     * @param ManagerRegistry $doctrine
     * @param ResourceVersionDTONormalizer $versionDtoNormalizer
     */
    public function __construct(ManagerRegistry $doctrine,ResourceVersionDTONormalizer $versionDtoNormalizer)
    {
        $this->customCallbackParams = [];
        $this->versionDtoNormalizer = $versionDtoNormalizer;
        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $normalizers = array(
            $this->getCallbacksNormalizer(),
            //$versionDtoNormalizer,
            new PropertyNormalizer($classMetadataFactory));
        parent::__construct($normalizers);
    }

    private function getCallbacksNormalizer()
    {
        $customCallbacks = [];
        $this->customCallbackParams = ["activeVersion"=>null];
        $customCallbacks["activeVersion"] = function ($version) {
            //throw new \Exception(json_encode($this->customCallbackParams["activeVersion"]) . '-' . get_class($version));
            //return "lol";
            return $this->versionDtoNormalizer->normalize($version,$this->customCallbackParams["activeVersion"]);
        };

        $normalizer = new GetSetMethodNormalizer();
        $normalizer->setCallbacks($customCallbacks);
        return $normalizer;
    }

    /**
     * @param array $normGroups
     * @throws NotAvailableGroupException
     */
    private function setCallbackParams(array $normGroups){
        $this->cleanCallbackParams();
        foreach($normGroups as $k=>$v){
            if($k === "this") continue;
            if(false && ! array_key_exists($k,$this->customCallbackParams)){
                throw new NotAvailableGroupException(
                    "Group " . $k . " doesn't support normalization subGroups in normalizer " . self::class);
            }
            else{
                $this->customCallbackParams[$k] = $v;
            }
        }
    }

    private function cleanCallbackParams(){
        foreach($this->customCallbackParams as $param=>$value){
            $this->customCallbackParams[$param] = null;
        }
    }

    public function supportsNormalization($data, $format = null)
    {
        return is_object($data) && get_class($data) === ResourceDTO::class;
    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        return true;
    }

    /**
     * @param ResourceDTO $object
     * @param array|null $groups
     * @param array $context
     * @return array
     * @throws InvalidArgumentException
     * @throws NotAvailableGroupException
     */
    public function normalize($object,$groups=null,array $context=[])
    {
        //return ["lol"];
        $normGroups = $this->handleGroups($groups);
        $this->setCallbackParams($normGroups);
        $normalization = $this->serializer->normalize($object, null, array('groups' => $normGroups["this"]));
        //throw new \Exception("lol");
        return $normalization;
    }

    /**
     * @param mixed $data
     * @param string $class
     * @param null $format
     * @param array $context
     * @return mixed
     * @throws InvalidArgumentException
     */
    public function denormalize($data, $class, $format = null, array $context = array())
    {
        // TODO implements ?
        return $data;
    }
}