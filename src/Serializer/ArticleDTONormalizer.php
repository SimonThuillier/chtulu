<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 07/04/18
 * Time: 20:05
 */

namespace App\Serializer;


use App\DTO\ArticleDTO;
use App\Factory\MediatorFactory;
use App\Helper\WAOHelper;
use App\Mediator\NotAvailableGroupException;
use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;


class ArticleDTONormalizer extends HNormalizer
{
    /**
     * @param WAOHelper $waoHelper
     * @param ManagerRegistry $doctrine
     * @param MediatorFactory $mediatorFactory
     * @param HDateNormalizer $hDateNormalizer
     * @param SimpleEntityNormalizer $simpleEntityNormalizer
     * @param ResourceGeometryDTONormalizer $resourceGeometryDTONormalizer
     * @param ResourceDTONormalizer $resourceDTONormalizer
     * @param UserDTONormalizer $userDTONormalizer
     */
    public function __construct(WAOHelper $waoHelper,
                                ManagerRegistry $doctrine,
                                MediatorFactory $mediatorFactory,
                                HDateNormalizer $hDateNormalizer,
                                SimpleEntityNormalizer $simpleEntityNormalizer,
                                ResourceGeometryDTONormalizer $resourceGeometryDTONormalizer,
                                ResourceDTONormalizer $resourceDTONormalizer,
                                UserDTONormalizer $userDTONormalizer
                                )
    {
        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $normalizers = array(
            $hDateNormalizer,
            $simpleEntityNormalizer,
            $resourceGeometryDTONormalizer,
            $resourceDTONormalizer,
            $userDTONormalizer,
            new HGetSetMethodNormalizer($classMetadataFactory),
            new ObjectNormalizer($classMetadataFactory)
        );

        parent::__construct($normalizers,$waoHelper,$doctrine,$mediatorFactory);
    }

    public function supportsNormalization($data, $format = null)
    {
        return is_object($data) && get_class($data) === ArticleDTO::class;
    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        return $type != null && $type === ArticleDTO::class;
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
        /*if(is_array($data) && array_key_exists('detailImageResource',$data)){
            $resourceEntity = $this->doctrine->
            getRepository(HResource::class)->find(intval($data['detailImageResource']['id']));
            $mediator = $this->mediatorFactory->create(ResourceDTO::class,$resourceEntity);
            $mediator->mapDTOGroups(['minimal'=>true]);
            $data['detailImageResource'] = $mediator->getDTO();
        }*/

        $denormalization = parent::defaultDenormalize($data, $class, $format,$context);
        return $denormalization;
    }
}