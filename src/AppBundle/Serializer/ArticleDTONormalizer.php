<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 07/04/18
 * Time: 20:05
 */

namespace AppBundle\Serializer;


use AppBundle\DTO\ArticleDTO;
use Doctrine\Common\Annotations\AnnotationReader;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\PropertyNormalizer;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;


class ArticleDTONormalizer extends HSerializer implements NormalizerInterface
{
    /**
     * @param ManagerRegistry $doctrine
     * @param HDateNormalizer $hDateSerializer
     */
    public function __construct(ManagerRegistry $doctrine, HDateNormalizer $hDateSerializer)
    {
        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $normalizers = array(
            $hDateSerializer,
            new PropertyNormalizer($classMetadataFactory),
            new ObjectNormalizer());

        parent::__construct($normalizers);
    }

    public function supportsNormalization($data, $format = null)
    {
        return is_object($data) && get_class($data) === ArticleDTO::class;
    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        return isset($data['__jsonclass__']) && 'json' === $format;
    }

    /**
     * @param ArticleDTO $object
     * @param array|null $groups
     * @param array $context
     * @return array
     * @throws InvalidArgumentException
     */
    public function normalize($object,$groups=null,array $context=[])
    {
            $normalization = $this->serializer->normalize($object, null, array('groups' => $groups));
        return $normalization;
    }

    /**
     * @param array $normalizedPayload
     * @param mixed|null $object
     * @return ArticleDTO
     * @throws InvalidArgumentException
     */
    public function denormalize($normalizedPayload,$object=null)
    {
        // TODO : implements ?
        return $object;
    }
}