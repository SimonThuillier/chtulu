<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 07/04/18
 * Time: 20:05
 */

namespace AppBundle\Serializer;


use AppBundle\DTO\ArticleDTO;
use AppBundle\DTO\ResourceDTO;
use AppBundle\Entity\HResource;
use AppBundle\Factory\MediatorFactory;
use AppBundle\Helper\WAOHelper;
use AppBundle\Mediator\NotAvailableGroupException;
use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;


class ArticleDTONormalizer extends HNormalizer
{

    /** @var ManagerRegistry */
    protected $doctrine;
    /** @var MediatorFactory */
    protected $mediatorFactory;

    /**
     * @param ManagerRegistry $doctrine
     * @param HDateNormalizer $hDateSerializer
     * @param SimpleEntityNormalizer $simpleEntityNormalizer
     * @param ResourceDTONormalizer $resourceDTONormalizer
     * @param WAOHelper $waoHelper
     */
    public function __construct(ManagerRegistry $doctrine,
                                HDateNormalizer $hDateSerializer,
                                SimpleEntityNormalizer $simpleEntityNormalizer,
                                ResourceDTONormalizer $resourceDTONormalizer,
                                WAOHelper $waoHelper,
                                MediatorFactory $mediatorFactory)
    {
        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $normalizers = array(
            $hDateSerializer,
            $simpleEntityNormalizer,
            $resourceDTONormalizer,
            new HGetSetMethodNormalizer($classMetadataFactory),
            new ObjectNormalizer($classMetadataFactory)
        );

        parent::__construct($normalizers,$waoHelper);

        $this->doctrine = $doctrine;
        $this->mediatorFactory = $mediatorFactory;

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
        if(is_array($data) && array_key_exists('detailImageResource',$data)){
            $resourceEntity = $this->doctrine->
            getRepository(HResource::class)->find(intval($data['detailImageResource']['id']));
            $mediator = $this->mediatorFactory->create(ResourceDTO::class,$resourceEntity);
            $mediator->mapDTOGroups(['minimal'=>true]);
            $data['detailImageResource'] = $mediator->getDTO();
        }


        $denormalization = parent::defaultDenormalize($data, $class, $format,$context);
        return $denormalization;
    }
}