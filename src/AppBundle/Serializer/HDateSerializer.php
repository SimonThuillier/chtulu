<?php
namespace AppBundle\Serializer;

use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Serializer\SerializerInterface;
use AppBundle\Factory\HDateFactory;
use AppBundle\Utils\HDate;
use AppBundle\Helper\DateHelper;
use AppBundle\Entity\DateType;

class HDateSerializer extends AbstractHSerializer implements HSerializerInterface
{
    /**
     *
     * @param ManagerRegistry $doctrine
     * @param SerializerInterface $serializer
     * @param HDateFactory $mainFactory
     */
    public function __construct(ManagerRegistry $doctrine, SerializerInterface $serializer, HDateFactory $mainFactory)
    {
        parent::__construct($doctrine, $serializer, $mainFactory);
        $this->classNames = [HDate::class];
        $this->mandatoryKeys = ["beginDate","endDate","type"];
    }

    /**
     * @param HDate $object
     * @return array
     * @throws SerializationException
     */
    public function normalize($object)
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
     * @return HDate
     * @throws DeserializationException
     */
    public function denormalize($normalizedPayload)
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
            $object = $this->mainFactory->create($normalizedPayload["type"],$normalizedPayload["beginDate"],
                $normalizedPayload["endDate"]);
        }
        catch(\Exception $e){
            throw new DeserializationException("Error while creating new '" .
                reset($classNames) . "' object :  " . $e->getMessage());
        }
        return $object;
    }
}