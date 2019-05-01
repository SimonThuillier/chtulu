<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 07/04/18
 * Time: 20:05
 */

namespace App\Serializer;


use App\Helper\WAOHelper;
use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;


class SimpleEntityNormalizer implements NormalizerInterface,DenormalizerInterface
{
    /**
     * @var WAOHelper
     */
    private $waoHelper;
    /**
     * @var HGetSetMethodNormalizer
     */
    private $normalizer;
    /** @var ManagerRegistry $doctrine */
    private $doctrine;

    /**
     * handles simple entities which are always normalized the same way
     * MediatorNormalizer constructor.
     * @param WAOHelper $waoHelper
     * @param ManagerRegistry $doctrine
     */
    public function __construct(WAOHelper $waoHelper,ManagerRegistry $doctrine)
    {
        $this->waoHelper = $waoHelper;
        $this->doctrine = $doctrine;

        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $this->normalizer = new HGetSetMethodNormalizer($classMetadataFactory);
    }

    public function supportsNormalization($data, $format = null)
    {
        return (is_object($data) && in_array(get_class($data),$this->waoHelper->getSimpleEntityClassNames()));
    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        $entityClassNames = $this->waoHelper->getSimpleEntityClassNames();
        return in_array($type,$entityClassNames);
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
        if (null === $data || $data === "") return null;
        if(is_array($data)) $data = $data["id"];

        return $this->doctrine->getRepository($class)->find(intval($data));
    }
}