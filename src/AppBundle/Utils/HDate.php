<?php
namespace AppBundle\Utils;
use AppBundle\Entity\DateType;
use AppBundle\Helper\DateHelper;

/**
 * 
 * @author belze
 * Class for historical Dates 
 */
class HDate
{
    /**
     * @var \DateTime
     */
    private $beginDate;
    /**
     * @var \DateTime
     */
    private $endDate;
    /**
     * @var DateType
     */
    private $type;
    
    
    
    public function __construct(DateType $type,\DateTime $date,$endDate = null)
    {
        $this->beginDate = $date;
        $this->endDate = $endDate;
        $this->setType($type);
        return $this;
    }


    /**
     * beginDate
     * @return \DateTime
     */
    public function getBeginDate(){
        return $this->beginDate;
    }

    /**
     * endDate
     * @return \DateTime
     */
    public function getEndDate(){
        return $this->endDate;
    }

    /**
     * type
     * @return DateType
     */
    public function getType(){
        return $this->type;
    }

    /**
     * type
     * @param DateType $type
     * @return HDate
     */
    public function setType($type)
    {
        switch($type->getId()){
            case DateType::PRECISE:
                $this->endDate = clone $this->beginDate;
                break;
            case DateType::BOUNDED:
                $this->endDate = ($this->endDate !== null)?$this->endDate:(clone $this->beginDate);
                if(DateHelper::dayDiff($this->beginDate,$this->endDate) === 0) DateHelper::addDay($this->endDate, 1);
                break;
            case DateType::MONTH:
                DateHelper::rewindToMonthFirst($this->beginDate);
                $this->endDate = DateHelper::addDay(DateHelper::switchToNextMonth(clone $this->beginDate,true),-1);
                break;
            case DateType::SEASON:
                DateHelper::rewindToSeasonFirst($this->beginDate);
                $this->endDate = DateHelper::addDay(DateHelper::switchToNextSeason(clone $this->beginDate,true),-1);
                break;
            /*case DateType::YEAR:
                this._beginDate.rewindToYearFirst();
                this._endDate = this._beginDate.clone().switchToNextYear(true).addDay(-1);
                break;
            case DateType::DECADE:
                this._beginDate.rewindToDecadeFirst();
                this._endDate = this._beginDate.clone().switchToNextDecade(true).addDay(-1);
                break;
            case DateType::CENTURY:
                this._beginDate.rewindToCenturyFirst();
                this._endDate = this._beginDate.clone().switchToNextCentury(true).addDay(-1);
                break;
            case DateType::MILLENIA:
                this._beginDate.rewindToMilleniaFirst();
                this._endDate = this._beginDate.clone().switchToNextMillenia(true).addDay(-1);
                break;*/
            default:break;
        }
        $this->type = $type;
        return $this;
    }

}