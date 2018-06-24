<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 07/04/18
 * Time: 20:05
 */

namespace AppBundle\Serializer;

use AppBundle\DTO\ResourceVersionDTO;
use Doctrine\Common\Annotations\AnnotationReader;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\PropertyNormalizer;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;


class ResourceVersionDTONormalizer extends HSerializer implements NormalizerInterface
{
    /**
     * @param ManagerRegistry $doctrine
     */
    public function __construct(ManagerRegistry $doctrine)
    {

        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $normalizers = array(
            new PropertyNormalizer($classMetadataFactory),
            new ObjectNormalizer());
        parent::__construct($normalizers);
    }

    public function supportsNormalization($data, $format = null)
    {
        return is_object($data) && get_class($data) === ResourceVersionDTO::class;
    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        return isset($data['__jsonclass__']) && 'json' === $format;
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
        $normalization = $this->serializer->normalize($object, null, array('groups' => $groups));
        throw new \Exception(json_encode($normalization) . ' - ' . json_encode($groups));
        return $normalization;
    }

    /**
     * @param array $normalizedPayload
     * @param mixed|null $object
     * @return ResourceVersionDTO
     * @throws InvalidArgumentException
     */
    public function denormalize($normalizedPayload,$object=null)
    {
        // TODO : implements ?
        return $object;
    }
}