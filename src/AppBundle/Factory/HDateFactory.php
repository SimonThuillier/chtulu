<?php
namespace AppBundle\Factory;

use AppBundle\Utils\HDate;
use AppBundle\Entity\DateType;
use AppBundle\Helper\DateHelper;

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
        $this->object = new HDate();
        $this->setData($type, $date,$endDate);
        return $this->object;
    }
    
    /**
     * 
     * @param DateType $type
     * @param \DateTime $date
     * @param \DateTime|null $endDate
     */
    private function setData(DateType $type,\DateTime $date,$endDate = null)
    {
        $this->object->setBeginDate($date->setTime(0, 0));
        $this->object->setEndDate(($endDate !== null)?$endDate->setTime(0, 0):null);
        $this->object->setType($type);
        
        switch($type->getId()){
            case DateType::PRECISE:
                $this->object->setEndDate(clone $date);
                break;
            case DateType::BOUNDED:
                $this->object->setEndDate(($endDate !== null)?$endDate:(clone $date));
                if(DateHelper::dayDiff($this->object->getBeginDate(),$this->object->getEndDate()) === 0) {
                    DateHelper::addDay($this->object->getEndDate(), 1);
                }
                break;
            case DateType::MONTH:
                DateHelper::rewindToMonthFirst($date);
                $this->object->setEndDate(DateHelper::addDay(DateHelper::switchToNextMonth(clone $date,true),-1));
                break;
            case DateType::SEASON:
                DateHelper::rewindToSeasonFirst($date);
                $this->object->setEndDate(DateHelper::addDay(DateHelper::switchToNextSeason(clone $date,true),-1));
                break;
            case DateType::YEAR:
                DateHelper::rewindToYearFirst($date);
                $this->object->setEndDate(DateHelper::addDay(DateHelper::switchToNextYear(clone $date,true),-1));
                break;
            case DateType::DECADE:
                DateHelper::rewindToDecadeFirst($date);
                $this->object->setEndDate(DateHelper::addDay(DateHelper::switchToNextDecade(clone $date,true),-1));
                break;
            case DateType::CENTURY:
                DateHelper::rewindToCenturyFirst($date);
                $this->object->setEndDate(DateHelper::addDay(DateHelper::switchToNextCentury(clone $date,true),-1));
                break;
            case DateType::MILLENIA:
                DateHelper::rewindToMilleniaFirst($date);
                $this->object->setEndDate(DateHelper::addDay(DateHelper::switchToNextMillenia(clone $date,true),-1));
                break;
            default:break;
        }
        $this->object->updateIndexes();
    }
}