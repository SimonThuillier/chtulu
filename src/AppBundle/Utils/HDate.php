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
    const formatters=[];
    
    
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
    
    /**
     * 
     * @param DateType $type
     * @param \DateTime $date
     * @param \DateTime|null $endDate
     * @return \AppBundle\Utils\HDate
     */
    public function __construct(DateType $type,\DateTime $date,$endDate = null)
    {
        $this->beginDate = $date->setTime(0, 0);
        $this->endDate = ($endDate !== null)?$endDate->setTime(0, 0):null;
        $this->setType($type);
        return $this;
    }
    
    /**
     * @return string
     */
 /*   public function __toString(){
        var formatter = this.formatters[this._type];
        var pieces=[];
        var label = formatter(this._beginDate,pieces);
        var BC;
        
        // specific code for rendering
        if(this._type == "bounded") {
            var endPieces=[];
            formatter(this._endDate,endPieces);
            var totalLabel="";
            var index = 4;
            for (index=4;index>-1;index--){
                if(pieces[index] == endPieces[index]){
                    totalLabel = pieces[index] + totalLabel;
                }
                else{index++;break;}
            }
            var preBeginLabel = "",preEndLabel = "";
            for(var index2=0;index2<index;index2++){
                preBeginLabel+= pieces[index2];
                preEndLabel+= endPieces[index2];
            }
            if(preBeginLabel !== ""){totalLabel = preBeginLabel + "~" + preEndLabel + totalLabel;}
            label = totalLabel;
        }
        else if(this._type == "precise" && pieces[0] == "1") {
            pieces[0] = "1er";
            label = pieces.join('');
        }
        else if(this._type == "season" && (pieces[0]).toUpperCase() == "HIVER"){
            pieces[pieces.length-1] = pieces[pieces.length-1] +
            ((Number(pieces[pieces.length-1])>=-1)?"-":"")  +
            (Number(pieces[pieces.length-1]) + 1);
            label = pieces.join('');
        }
        else if(this._type == "decade"){
            label = "Années " + label;
        }
        else if(this._type == "century"){
            var century = Math.floor(Number(label)/100);
            BC = century < 0;
            var absoluteCentury = BC?Math.abs(century):(century + 1);
            
            label = arabicToRomanNumber(absoluteCentury) +
            ((absoluteCentury == 1)?"er":"e") +
            " siècle" +
            (BC?" Av. JC":"");
        }
        else if(this._type == "millenia"){
            var millenia = Math.floor(Number(label)/1000);
            BC = millenia < 0;
            var absoluteMillenia = BC?Math.abs(millenia):(millenia + 1);
            
            label = arabicToRomanNumber(absoluteMillenia) +
            ((absoluteMillenia == 1)?"er":"e") +
            " millénaire" +
            (BC?" Av. JC":"");
        }
        return label;
    }*/
    

    /**
     * 
     * @param self $hdate
     * @return string[]|NULL[]
     */
    static function toArray(HDate $hdate){
        return [
            'beginDate' => ($hdate->getBeginDate()->format('Y-m-d') . 'T00:00:00.000Z' ),
            'endDate' => ($hdate->getEndDate()->format('Y-m-d') . 'T00:00:00.000Z' ),
            'type' => $hdate->getType()->getId()
        ];
    }
    
    /**
     * 
     * @param self $hdate
     * @return string
     */
    static function toJSON($hdate){
        return json_encode(self::toArray($hdate));
    }

    /**
     * beginDate
     * @return \DateTime
     */
    public function getBeginDate(){
        return $this->beginDate;
    }
    
    /**
     * beginDate
     * @param string $beginDate
     * @return HDate
     */
    public function setBeginDate($beginDate){
        $this->beginDate = $beginDate;
        return $this;
    }

    /**
     * endDate
     * @return \DateTime
     */
    public function getEndDate(){
        return $this->endDate;
    }
    
    /**
     * endDate
     * @param string $endDate
     * @return HDate
     */
    public function setEndDate($endDate){
        $this->endDate = $endDate;
        return $this;
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
            case DateType::YEAR:
                DateHelper::rewindToYearFirst($this->beginDate);
                $this->endDate = DateHelper::addDay(DateHelper::switchToNextYear(clone $this->beginDate,true),-1);
                break;
            case DateType::DECADE:
                DateHelper::rewindToDecadeFirst($this->beginDate);
                $this->endDate = DateHelper::addDay(DateHelper::switchToNextDecade(clone $this->beginDate,true),-1);
                break;
            case DateType::CENTURY:
                DateHelper::rewindToCenturyFirst($this->beginDate);
                $this->endDate = DateHelper::addDay(DateHelper::switchToNextCentury(clone $this->beginDate,true),-1);
                break;
            case DateType::MILLENIA:
                DateHelper::rewindToMilleniaFirst($this->beginDate);
                $this->endDate = DateHelper::addDay(DateHelper::switchToNextMillenia(clone $this->beginDate,true),-1);
                break;
            default:break;
        }
        $this->type = $type;
        return $this;
    }

}