<?php
namespace AppBundle\Serializer;

use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use AppBundle\Factory\HDateFactory;
use AppBundle\Utils\HDate;
use AppBundle\Helper\DateHelper;
use AppBundle\Entity\DateType;

class HDateNormalizer extends HSerializer implements NormalizerInterface
{
    /** @var ManagerRegistry */
    private $doctrine;
    /** @var HDateFactory */
    private $mainFactory;

    /**
     * @param ManagerRegistry $doctrine
     * @param HDateFactory $mainFactory
     */
    public function __construct(ManagerRegistry $doctrine, HDateFactory $mainFactory)
    {
        parent::__construct([]);
        $this->doctrine = $doctrine;
        $this->mainFactory = $mainFactory;
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
     * @param array $normalizedPayload
     * @param HDate|null $object
     * @return HDate
     * @throws InvalidArgumentException
     */
    public function denormalize($normalizedPayload,$object=null)
    {
        try{
            $normalizedPayload["beginDate"] = DateHelper::createFromJson($normalizedPayload["beginDate"]);
            $normalizedPayload["endDate"] = DateHelper::createFromJson($normalizedPayload["endDate"]);
            $normalizedPayload["type"] = $this->doctrine->getRepository(DateType::class)
                ->find(intval($normalizedPayload["type"]));
        }
        catch(\Exception $e){
            throw new InvalidArgumentException("Invalid argument for transformation while deserializing to " .
                HDate::class . " :  " . $e->getMessage());
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
            throw new InvalidArgumentException("Error while deserializing onto '" .
                HDate::class . "' object :  " . $e->getMessage());
        }
        return $object;
    }
}