<?php
namespace AppBundle\Serializer;

use AppBundle\Helper\WAOHelper;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use AppBundle\Factory\HDateFactory;
use AppBundle\Utils\HDate;
use AppBundle\Helper\DateHelper;
use AppBundle\Entity\DateType;

class HDateNormalizer extends HNormalizer
{
    /** @var ManagerRegistry */
    private $doctrine;
    /** @var HDateFactory */
    private $mainFactory;

    /**
     * @param ManagerRegistry $doctrine
     * @param HDateFactory $mainFactory
     * @param WAOHelper $waoHelper
     */
    public function __construct(ManagerRegistry $doctrine, HDateFactory $mainFactory,WAOHelper $waoHelper)
    {
        parent::__construct([],$waoHelper);
        $this->doctrine = $doctrine;
        $this->mainFactory = $mainFactory;
    }

    public function supportsNormalization($data, $format = null)
    {
        return is_object($data) && get_class($data) === HDate::class;
    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        return $type === Hdate::class || (isset($data['beginDate']) && isset($data['endDate']) && isset($data['type']));
    }

    /**
     * @param HDate $object
     * @param array|null $groups
     * @param array $context
     * @return array
     * @throws InvalidArgumentException
     */
    public function normalize($object,$groups=null,array $context=[])
    {
        try{
            $normalization = [
                'beginDate' => ($object->getBeginDate()->format('Y-m-d') . 'T00:00:00.000Z' ),
                'endDate' => ($object->getEndDate()->format('Y-m-d') . 'T00:00:00.000Z' ),
                'type' => $object->getType()->getId()]
            ;
        }
        catch(\Exception $e){
            throw new InvalidArgumentException("Error while serializing object of class " .
                get_class($object) . " :  " . $e->getMessage());
        }
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
        try{
            $data["beginDate"] = DateHelper::createFromJson($data["beginDate"]);
            $data["endDate"] = DateHelper::createFromJson($data["endDate"]);
            $data["type"] = $this->doctrine->getRepository(DateType::class)
                ->find(intval($data["type"]));
        }
        catch(\Exception $e){
            throw new InvalidArgumentException("Invalid argument for transformation while deserializing to " .
                HDate::class . " :  " . $e->getMessage());
        }
        try{
            $object = $this->mainFactory->create($data["type"],$data["beginDate"], $data["endDate"]);

        }
        catch(\Exception $e){
            throw new InvalidArgumentException("Error while deserializing onto '" .
                HDate::class . "' object :  " . $e->getMessage());
        }
        return $object;
    }
}