<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 07/04/18
 * Time: 20:05
 */

namespace App\Serializer;


use App\DTO\ArticleDTO;
use App\DTO\ResourceGeometryDTO;
use App\Helper\WAOHelper;
use App\Mediator\NotAvailableGroupException;
use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;


class ResourceGeometryDTONormalizer extends HNormalizer
{
    /**
     * @param ManagerRegistry $doctrine
     * @param HDateNormalizer $hDateSerializer
     * @param SimpleEntityNormalizer $simpleEntityNormalizer
     * @param GeoJsonNormalizer $geoJsonNormalizer
     * @param ResourceDTONormalizer $resourceDTONormalizer
     * @param WAOHelper $waoHelper
     */
    public function __construct(ManagerRegistry $doctrine,
                                HDateNormalizer $hDateSerializer,
                                SimpleEntityNormalizer $simpleEntityNormalizer,
                                GeoJsonNormalizer $geoJsonNormalizer,
                                ResourceDTONormalizer $resourceDTONormalizer,
                                WAOHelper $waoHelper)
    {
        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $normalizers = array(
            $hDateSerializer,
            $simpleEntityNormalizer,
            $geoJsonNormalizer,
            $resourceDTONormalizer,
            new HGetSetMethodNormalizer($classMetadataFactory),
            new ObjectNormalizer());

        parent::__construct($normalizers,$waoHelper);
    }

    public function supportsNormalization($data, $format = null)
    {
        return is_object($data) && get_class($data) === ResourceGeometryDTO::class;
    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        return false;
    }

    /**
     * @param ArticleDTO $object
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
        // TODO : implements ?
        return $data;
    }
}