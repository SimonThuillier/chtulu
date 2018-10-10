<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 07/04/18
 * Time: 20:05
 */

namespace AppBundle\Serializer;


use AppBundle\Helper\SimpleEntityHelper;
use Doctrine\Common\Annotations\AnnotationReader;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;


class SimpleEntityNormalizer implements NormalizerInterface
{
    /**
     * @var SimpleEntityHelper
     */
    private $simpleEntityHelper;
    /**
     * @var HGetSetMethodNormalizer
     */
    private $normalizer;

    /**
     * handles simple entities which are always normalized the same way
     * MediatorNormalizer constructor.
     * @param SimpleEntityHelper $simpleEntityHelper
     */
    public function __construct(SimpleEntityHelper $simpleEntityHelper)
    {
        $this->simpleEntityHelper = $simpleEntityHelper;

        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $this->normalizer = new HGetSetMethodNormalizer($classMetadataFactory);
    }

    public function supportsNormalization($data, $format = null)
    {
        return (is_object($data) && in_array(get_class($data),$this->simpleEntityHelper->getEntityClassNames()));
    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        return false;
    }

    /**
     * @inheritdoc
     */
    public function normalize($object,$groups=null,array $context=[])
    {
        return $this->normalizer->normalize($object);
    }

    /**
     * @inheritdoc
     */
    public function denormalize($data, $class, $format = null, array $context = array())
    {
        return $data;
    }
}