<?php

namespace AppBundle\Helper;


class DateHelper
{
    static function date2Index(){
        
    }
    
    /**
     * compute number of days of difference between two dates
     * @param \DateTime $date1
     * @param \DateTime $date2
     * @return integer
     */
    static function dayDiff(\DateTime $date1,\DateTime $date2)
    {
        return ($date1->diff($date2))->days;
    }
    
    /**
     * compute number of days of difference between two dates
     * @param \DateTime $date
     * @param integer $days
     */
    static function addDay(\DateTime $date,$days)
    {
        if ($days == 0) return;
        $date->modify((($days<0)?'-':'+') . Math.abs($days) . ' day');
    }
    
    /**
     * wrapper for \DateTime static method createFromFormat handling negative year for / separated format
     * this function is dangerous to use ! TODO : think about an improvement
     * @param String $format
     * @param String $dateStr
     * @return \DateTime
     */
    static function createFromFormat($format,$dateStr)
    {
        $bC = false;
        if(strpos($dateStr,'-') !== false){
            $dateStr = str_replace('-','',$dateStr);
            $bC = true;
        }
        $date= \DateTime::createFromFormat($format,$dateStr);
        if($bC) $date->setDate(-$date->format('Y'), $date->format('m'), $date->format('d'));
        return $date;
    }
    
    
    static function rewindToMonthFirst(\DateTime $date)
    {
        return $date->setDate($date->format('Y'), $date->format('m'), '1');
    }
    
    static function switchToNextMonth(\DateTime $date,$force=false,$exact=false)
    {
        if ($exact) return $date->modify('+ 1 month');
        if($force || ($date->format('j') !=="1") ){
            $date->setDate($date->format('Y'), $date->format('m')+1, '1');
        }
        return $date;
    }
    
    
    
    
}