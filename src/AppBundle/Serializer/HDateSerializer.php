<?php
namespace AppBundle\Serializer;

use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use AppBundle\Factory\HDateFactory;
use AppBundle\Utils\HDate;
use AppBundle\Helper\DateHelper;
use AppBundle\Entity\DateType;

class HDateSerializer extends AbstractHSerializer implements HSerializer,NormalizerInterface
{
    /**
     * @var HDateFactory
     */
    private $mainFactory;

    /**
     * @param ManagerRegistry $doctrine
     * @param HDateFactory $mainFactory
     */
    public function __construct(ManagerRegistry $doctrine, HDateFactory $mainFactory)
    {
        parent::__construct($doctrine);
        $this->mainFactory = $mainFactory;

        $encoders = array(new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $this->serializer = new Serializer($normalizers,$encoders);

        $this->classNames = [HDate::class];
        $this->mandatoryKeys = ["beginDate","endDate","type"];
    }

    public function supportsNormalization($data, $format = null)
    {
        return is_object($data) && get_class($data) === HDate::class;
    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        return isset($data['__jsonclass__']) && 'json' === $format;
    }



    /**
     * @param HDate $object
     * @param array|null $groups
     * @param array $context
     * @return array
     * @throws SerializationException
     */
    public function normalize($object,$groups=null,array $context=[])
    {
        $this->preCheckNormalize($object);
        try{
            $normalization = [
                'beginDate' => ($object->getBeginDate()->format('Y-m-d') . 'T00:00:00.000Z' ),
                'endDate' => ($object->getEndDate()->format('Y-m-d') . 'T00:00:00.000Z' ),
                'type' => $object->getType()->getId()]
            ;
        }
        catch(\Exception $e){
            throw new SerializationException("Error while serializing object of class " .
                get_class($object) . " :  " . $e->getMessage());
        }
        return $normalization;
    }

    /**
     * @param array $normalizedPayload
     * @param HDate|null $object
     * @return HDate
     * @throws DeserializationException
     */
    public function denormalize($normalizedPayload,$object=null)
    {
        $this->preCheckDenormalize($normalizedPayload);
        try{
            $normalizedPayload["beginDate"] = DateHelper::createFromJson($normalizedPayload["beginDate"]);
            $normalizedPayload["endDate"] = DateHelper::createFromJson($normalizedPayload["endDate"]);
            $normalizedPayload["type"] = $this->doctrine->getRepository(DateType::class)
                ->find(intval($normalizedPayload["type"]));
        }
        catch(\Exception $e){
            throw new DeserializationException("Invalid argument for transformation while deserializing to " .
                reset($classNames) . " :  " . $e->getMessage());
        }

        try{
            if($object !== null){
                $this->mainFactory
                    ->setObject($object)
                    ->setData($normalizedPayload["type"],$normalizedPayload["beginDate"], ["endDate"])
                    ->getObject();
            }
            else{
                $object = $this->mainFactory->create($normalizedPayload["type"],$normalizedPayload["beginDate"],
                    $normalizedPayload["endDate"]);
            }
        }
        catch(\Exception $e){
            throw new DeserializationException("Error while deserializing onto '" .
                reset($classNames) . "' object :  " . $e->getMessage());
        }
        return $object;
    }
}