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
        if($bC) self::setYear($date, -$date->format('Y'));
        return $date;
    }
    
    static function getDate(\DateTime $date)
    {
        return intval($date->format('j'));
    }
    
    static function setDate(\DateTime $date,$day)
    {
        $date->setDate($date->format('Y'),$date->format('m'), $day);
    }
    
    static function getMonth(\DateTime $date)
    {
        return intval($date->format('m')) -1;
    }
    
    static function setMonth(\DateTime $date,$month)
    {
        $date->setDate($date->format('Y'), $month+1, $date->format('j'));
    }
    
    static function getSeason(\DateTime $date)
    {
        $season = floor(self::getMonth($date)/3);
        $isChangingMonth = ((self::getMonth($date)+1)%3) === 0;
        if ($isChangingMonth && self::getDate($date) > 20 )  $season++;
        return $season%4;
    }
    
    static function getYear(\DateTime $date)
    {
        return intval($date->format('Y'));
    }
    
    static function setYear(\DateTime $date,$year)
    {
        $date->setDate($year,$date->format('m'), $date->format('j'));
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
    
    static function rewindToSeasonFirst(\DateTime $date)
    {
        $isChangingYear = (self::getMonth($date) == 11 && self::getDate($date) > 20);
        if ($isChangingYear){$month = 11;}
        else{
            $season = self::getSeason($date);
            $month = $season*3 - 1;
        }
        self::setMonth($date, $month);
        self::setDate($date, 21);
        return $date;
    }
    
    static function switchToNextSeason(\DateTime $date,$force=false,$exact=false)
    {
        if ($exact) return $date->modify('+ 3 month');
        $isChangingMonth = ((self::getMonth($date)+1)%3) === 0;
        $newMonth = self::getMonth($date)-((self::getMonth($date)+1)%3) + 3;
        
        self::setDate($date, 21);
        if($force || ! (self::getDate($date) < 21 && $isChangingMonth) ){
            self::setMonth($date, $newMonth);
        }
        return $date;
    }
    
    
    
    
}