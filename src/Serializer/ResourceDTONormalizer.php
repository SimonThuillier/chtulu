<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 07/04/18
 * Time: 20:05
 */

namespace App\Serializer;

use App\DTO\ResourceDTO;
use App\Entity\HResource;
use App\Factory\DTOFactory;
use App\Factory\MediatorFactory;
use App\Helper\WAOHelper;
use App\Mediator\DTOMediator;
use App\Mediator\NotAvailableGroupException;
use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;


class ResourceDTONormalizer extends HNormalizer implements NormalizerInterface
{

    /** @var ManagerRegistry $doctrine */
    private $doctrine;
    /** @var MediatorFactory $mediatorFactory */
    private $mediatorFactory;

    /**
     * @param ManagerRegistry $doctrine
     * @param ResourceVersionDTONormalizer $versionDtoNormalizer
     * @param WAOHelper $waoHelper
     * @param MediatorFactory $mediatorFactory
     */
    public function __construct(ManagerRegistry $doctrine,
                                ResourceVersionDTONormalizer $versionDtoNormalizer,
                                WAOHelper $waoHelper,
                                MediatorFactory $mediatorFactory
    )
    {
        $this->doctrine = $doctrine;
        $this->mediatorFactory = $mediatorFactory;
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

        if(array_key_exists("id",$data)){
            $id = intval($data["id"]);
            if(!$id || $id < 0) return null;
            $resource = $this->doctrine->getRepository(HResource::class)->find($id);
            if(!$resource) return null;


            $mediator = $this->mediatorFactory->create(ResourceDTO::class,$resource);
            $mediator->mapDTOGroups(["minimal"=>true],DTOMediator::NOTHING_IF_NULL);

            $denormalization = $mediator->getDTO();
            $test = 'lol';
            return $denormalization;
        }




        //$denormalization = parent::defaultDenormalize($data, $class, $format,$context);
        //return $denormalization;
    }
}