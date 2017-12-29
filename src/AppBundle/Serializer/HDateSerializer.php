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
        $this->className = HDate::class;
    }

    /**
     *
     * {@inheritdoc}
     * @see \AppBundle\Serializer\HSerializerInterface::serialize()
     */
    public function serialize($object)
    {
        // TODO: Auto-generated method stub
    }

    /**
     *
     * {@inheritdoc}
     * @see \AppBundle\Serializer\HSerializerInterface::deserialize()
     */
    public function deserialize($payload)
    {
        parent::decode($payload);
        
        $this->array["beginDate"] = DateHelper::createFromJson($this->array["beginDate"]);
        $this->array["endDate"] = DateHelper::createFromJson($this->array["endDate"]);
      
        $this->array["type"] = $this->doctrine->getRepository(DateType::class)
        ->find(intval($this->array["type"]));
        
        return $this->mainFactory->newInstance($this->array["type"],$this->array["beginDate"],$this->array["endDate"]);  
    }
}