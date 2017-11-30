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
    
    private $test;
    
    /**
     * @return \AppBundle\Utils\HDate
     */
    public function __construct()
    {
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
        $this->type = $type;
        return $this;
    }

}