<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 07/04/18
 * Time: 20:05
 */

namespace AppBundle\Serializer;

use AppBundle\DTO\ResourceImageDTO;
use AppBundle\DTO\ResourceVersionDTO;
use Doctrine\Common\Annotations\AnnotationReader;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\PropertyNormalizer;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;


class ResourceVersionDTONormalizer extends HNormalizer implements NormalizerInterface
{
    /**
     * @param ManagerRegistry $doctrine
     */
    public function __construct(ManagerRegistry $doctrine)
    {

        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $normalizers = array(
            new PropertyNormalizer($classMetadataFactory),);
            //new ObjectNormalizer());
        parent::__construct($normalizers);
    }

    public function supportsNormalization($data, $format = null)
    {
       /* if(is_object($data)){
            var_dump(get_class($data));
        }*/
        return is_object($data) && in_array(get_class($data),
                [ResourceVersionDTO::class, ResourceImageDTO::class]);
    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        return true;
    }

    /**
     * @param ResourceVersionDTO $object
     * @param array|null $groups
     * @param array $context
     * @return array
     * @throws InvalidArgumentException
     */
    public function normalize($object,$groups=null,array $context=[])
    {
        var_dump(get_class($object));
        //return "lol";
        $normalization = $this->serializer->normalize($object, null, array('groups' => $groups));
        //throw new \Exception(json_encode($groups));
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
        // TODO : implements ?
        return $data;
    }
}