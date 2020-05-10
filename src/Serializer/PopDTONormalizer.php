<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 07/04/18
 * Time: 20:05
 */

namespace App\Serializer;


use App\DTO\PopDTO;
use App\Factory\MediatorFactory;
use App\Helper\WAOHelper;
use App\Mediator\NotAvailableGroupException;
use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;


class PopDTONormalizer extends HNormalizer
{
    /**
     * @param WAOHelper $waoHelper
     * @param ManagerRegistry $doctrine
     * @param MediatorFactory $mediatorFactory
     * @param SimpleEntityNormalizer $simpleEntityNormalizer
     * @param GeoJsonNormalizer $geoJsonNormalizer
     */
    public function __construct(WAOHelper $waoHelper,
                                ManagerRegistry $doctrine,
                                MediatorFactory $mediatorFactory,
                                SimpleEntityNormalizer $simpleEntityNormalizer,
                                GeoJsonNormalizer $geoJsonNormalizer)
    {
        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $normalizers = array(
            $simpleEntityNormalizer,
            $geoJsonNormalizer,
            new HGetSetMethodNormalizer($classMetadataFactory),
            new ObjectNormalizer());

        parent::__construct($normalizers,$waoHelper,$doctrine,$mediatorFactory);
    }

    public function supportsNormalization($data, $format = null)
    {
        return is_object($data) && get_class($data) === PopDTO::class;
    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        return $type != null && $type === PopDTO::class;
    }

    /**
     * @param PopDTO $object
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
        $denormalization = parent::defaultDenormalize($data, $class, $format,$context);
        return $denormalization;
    }
}