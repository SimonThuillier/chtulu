<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 07/04/18
 * Time: 20:05
 */

namespace AppBundle\Serializer;

use AppBundle\DTO\ResourceDTO;
use AppBundle\Helper\WAOHelper;
use AppBundle\Mediator\NotAvailableGroupException;
use Doctrine\Common\Annotations\AnnotationReader;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;


class ResourceDTONormalizer extends HNormalizer implements NormalizerInterface
{

    /**
     * @param ManagerRegistry $doctrine
     * @param ResourceVersionDTONormalizer $versionDtoNormalizer
     * @param WAOHelper $waoHelper
     */
    public function __construct(ManagerRegistry $doctrine,
                                ResourceVersionDTONormalizer $versionDtoNormalizer,
                                WAOHelper $waoHelper)
    {
        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $normalizers = array(
            $versionDtoNormalizer,
            //new PropertyNormalizer($classMetadataFactory),
            new HGetSetMethodNormalizer($classMetadataFactory),
            new ObjectNormalizer());
        parent::__construct($normalizers,$waoHelper);
       /* $this->subGroupables = ["activeVersion"=>($this->versionDtoNormalizer),
            "lol"=>($this->versionDtoNormalizer),
            "lol2"=>($this->versionDtoNormalizer)
        ];*/
    }

    public function supportsNormalization($data, $format = null)
    {
        return is_object($data) && get_class($data) === ResourceDTO::class;
    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        return $type===ResourceDTO::class;
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
        $normalization = parent::defaultNormalize($object,$groups,$context);
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
        if(is_object($data) && get_class($data) === $class ) return $data;


        $denormalization = parent::defaultDenormalize($data, $class, $format,$context);
        return $denormalization;
    }
}