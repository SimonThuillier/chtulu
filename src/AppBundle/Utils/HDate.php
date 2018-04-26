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
    const FORMATTERS=[1=>'j_n_Y',
                      2=>'j_n_Y',
                      3=>'n_Y',
                      4=>'n_Y',
                      5=>'Y',
                      6=>'Y',
                      7=>'Y',
                      8=>'Y'];

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
     * @return \AppBundle\Utils\HDate
     */
    public function __construct()
    {
        return $this;
    }

    /**
     * label
     * @return string
     */
    public function getLabel(){
        if($this->beginDate === null) return '';

        $label = $this->beginDate->format(self::FORMATTERS[$this->type->getId()]);
        $pieces=explode('_',$label);
        //$BC = false;

        // specific code for rendering
        if($this->type->getId() == DateType::PRECISE) {
            $pieces[1] = DateHelper::MONTHS[$pieces[1]-1];
            if($pieces[0] === "1") $pieces[0] = "1er";
            $label = join(' ',$pieces);
        }
        else if($this->type->getId() == DateType::BOUNDED) {
            $pieces[1] = DateHelper::MONTHS[$pieces[1]-1];
            $endPieces=explode('_',$this->endDate->format(self::FORMATTERS[$this->type->getId()]));
            $endPieces[1] = DateHelper::MONTHS[$endPieces[1]-1];
            $totalLabel="";
            for ($index=2;$index>-1;$index--){
                if($pieces[$index] == $endPieces[$index]){
                    $totalLabel = $pieces[$index] . ' ' . $totalLabel;
                }
                else{$index++;break;}
            }
            $preBeginLabel = "";
            $preEndLabel = "";
            for($index2=0;$index2<$index;$index2++){
                $preBeginLabel.= $pieces[$index2] . ' ';
                $preEndLabel.= $endPieces[$index2] . ' ';
            }
            if($preBeginLabel !== ""){$totalLabel = trim($preBeginLabel) . "~" . trim($preEndLabel) .' '. $totalLabel;}
            $label = trim($totalLabel);
        }
        else if($this->type->getId() == DateType::MONTH) {
            $pieces[0] = DateHelper::MONTHS[$pieces[0]-1];
            $label = join(' ',$pieces);
        }
        else if($this->type->getId() === DateType::SEASON){
            $pieces[0] = DateHelper::getSeasonLabel($this->beginDate);
            if(strtoupper($pieces[0]) === "HIVER"){
                $pieces[count($pieces)-1] .=(
                    ((intval(end($pieces))>=-1)?"-":"")  .
                    (intval(end($pieces)) + 1) );
            }
            $label = join(' ',$pieces);
        }
        else if($this->type->getId() == DateType::DECADE){
            $label = "Années " . $label;
        }
        else if($this->type->getId() == DateType::CENTURY){
            $century = floor(intval($label)/100);
            $BC = $century < 0;
            $absoluteCentury = $BC?abs($century):($century + 1);

            $label = Numbers_Roman::toRoman($absoluteCentury) .
                (($absoluteCentury == 1)?"er":"e") .
                " siècle" .
                ($BC?" Av. JC":"");
        }
        else if($this->type->getId() == DateType::MILLENIA){
            $millenia = floor(intval($label)/1000);
            $BC = $millenia < 0;
            $absoluteMillenia = $BC?abs($millenia):($millenia + 1);

            $label = Numbers_Roman::toRoman($absoluteMillenia) .
                (($absoluteMillenia == 1)?"er":"e") .
                " millénaire" .
                ($BC?" Av. JC":"");
        }
        return $label;
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
     * @param \DateTime $beginDate
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
     * @param \DateTime $endDate
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
        $this->type = $type;
        return $this;
    }

    /**
     * @doc compare two HDates
     * returns 0 if both HDates are identical or one includes completely the other
     * returns -2 if hDate1 both beginDate and endHDate are strictly inferior to hDate2 beginDate
     * returns -1 if hDate1 beginDate is strictly inferior to hDate2 beginDate, hDate2 endDate is free
     * and vice-versa
     * @param HDate $hDate1
     * @param HDate $hDate2
     * @return integer
     */
    public static function compareHDates(HDate $hDate1,HDate $hDate2){
        $b1 = DateHelper::dateToIndex($hDate1->getBeginDate());
        $e1 = DateHelper::dateToIndex($hDate1->getEndDate());
        $b2 = DateHelper::dateToIndex($hDate2->getBeginDate());
        $e2 = DateHelper::dateToIndex($hDate2->getEndDate());

        if($b1<$b2 && $e1<$b2){return -2;}
        elseif($b1>$e2 && $e1>$e2){return 2;}
        elseif($b1<$b2 && $e1<$e2){return -1;}
        elseif($b1>$b2 && $e1>$e2){return 1;}
        else{return 0;}
    }
}