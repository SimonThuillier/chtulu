<?php
namespace AppBundle\Factory;

use AppBundle\Utils\HDate;
use AppBundle\Entity\DateType;

class HDateFactory
{
    private $object;
    
    
    
    /**
     * 
     * @param DateType $type
     * @param \DateTime $date
     * @param \DateTime|null $endDate
     * @return HDate
     */
    public function newInstance(DateType $type,\DateTime $date,$endDate = null)
    {
        $object = new HDate();
        
        
        return $hDate;
    }
    
    public function setData(DateType $type,\DateTime $date,$endDate = null)
    {
    }
}