<?php

namespace AppBundle\Helper;


class DateHelper
{
    const SEASONS = ["Hiver","Printemps","Ete","Automne"];
    const MONTHS = ["Janvier","Fevrier","Mars","Avril","Mai","Juin",
                    "Juillet","Aout","Septembre","Octobre","Novembre","Decembre"];


    static function date2Index()
    {
        return;
    }

    /**
     * compute number of days of difference between two dates
     * @param \DateTime $date1
     * @param \DateTime $date2
     * @return integer
     */
    static function dayDiff(\DateTime $date1, \DateTime $date2)
    {
        return $date1->diff($date2)->d;
    }

    /**
     * compute number of days of difference between two dates
     * @param \DateTime $date
     * @param integer $days
     * @return \DateTime
     */
    static function addDay(\DateTime $date, $days)
    {
        if ($days == 0) {
            return $date;
        }
        $date->modify((($days < 0) ? '-' : '+') . abs($days) . ' day');
        return $date;
    }

    /**
     * wrapper for \DateTime static method createFromFormat handling negative year for / separated format
     * this function is dangerous to use ! TODO : think about an improvement
     * @param String $format
     * @param String $dateStr
     * @return \DateTime
     */
    static function createFromFormat($format, $dateStr)
    {
        $bC = false;
        if (strpos($dateStr, '-') !== false) {
            $dateStr = str_replace('-', '', $dateStr);
            $bC      = true;
        }
        $date = \DateTime::createFromFormat($format, $dateStr);
        if ($bC) {
            self::setYear($date, -$date->format('Y'));
        }
        return $date;
    }

    /**
     * @param \DateTime $date
     * @return int
     */
    static function getDate(\DateTime $date)
    {
        return intval($date->format('j'));
    }

    /**
     * @param \DateTime $date
     * @param $day
     */
    static function setDate(\DateTime $date, $day)
    {
        $date->setDate($date->format('Y'), $date->format('m'), $day);
    }

    /**
     * @param \DateTime $date
     * @return int
     */
    static function getMonth(\DateTime $date)
    {
        return intval($date->format('n')) - 1;
    }

    /**
     * @param \DateTime $date
     * @param $month
     */
    static function setMonth(\DateTime $date, $month)
    {
        $date->setDate($date->format('Y'), $month + 1, $date->format('j'));
    }

    /**
     * get the season number (winter : 0 ... fall : 3) of a date
     * @param \DateTime $date
     * @return int
     */
    static function getSeason(\DateTime $date)
    {
        $season          = floor(self::getMonth($date) / 3);
        $isChangingMonth = ((self::getMonth($date) + 1) % 3) === 0;
        if ($isChangingMonth && self::getDate($date) > 20) {
            $season++;
        }
        return $season % 4;
    }

    /**
     * get the season label of a date
     * @param \DateTime $date
     * @return string
     */
    static function getSeasonLabel(\DateTime $date)
    {
        return self::SEASONS[self::getSeason($date)];
    }

    /**
     * @param \DateTime $date
     * @return int
     */
    static function getYear(\DateTime $date)
    {
        return intval($date->format('Y'));
    }

    /**
     * @param \DateTime $date
     * @param $year
     */
    static function setYear(\DateTime $date, $year)
    {
        $date->setDate($year, $date->format('m'), $date->format('j'));
    }

    /**
     * @param \DateTime $date
     * @return \DateTime
     */
    static function rewindToMonthFirst(\DateTime $date)
    {
        $date->setDate($date->format('Y'), $date->format('m'), '1');
        return $date;
    }

    /**
     * @param \DateTime $date
     * @param bool $force
     * @param bool $exact
     * @return \DateTime
     */
    static function switchToNextMonth(\DateTime $date, $force = false, $exact = false)
    {
        if ($exact) {
            $date->modify('+ 1 month');
            return $date;
        }
        if ($force || ($date->format('j') !== "1")) {
            $date->setDate($date->format('Y'), self::getMonth($date) + 2, '1');
        }
        return $date;
    }

    /**
     * @param \DateTime $date
     * @return \DateTime
     */
    static function rewindToSeasonFirst(\DateTime $date)
    {
        $isChangingYear = (self::getMonth($date) == 11 && self::getDate($date) > 20);
        if ($isChangingYear) {
            $month = 11;
        } else {
            $season = self::getSeason($date);
            $month  = $season * 3 - 1;
        }
        self::setMonth($date, $month);
        self::setDate($date, 21);
        return $date;
    }

    /**
     * @param \DateTime $date
     * @param bool $force
     * @param bool $exact
     * @return \DateTime
     */
    static function switchToNextSeason(\DateTime $date, $force = false, $exact = false)
    {
        if ($exact) {
            $date->modify('+ 3 month');
            return $date;
        }
        $isChangingMonth = ((self::getMonth($date) + 1) % 3) === 0;
        $newMonth        = self::getMonth($date) - ((self::getMonth($date) + 1) % 3) + 3;

        self::setDate($date, 21);
        if ($force || !(self::getDate($date) < 21 && $isChangingMonth)) {
            self::setMonth($date, $newMonth);
        }
        return $date;
    }

    /**
     * @param \DateTime $date
     * @return \DateTime
     */
    static function rewindToYearFirst(\DateTime $date)
    {
        self::setMonth($date, 0);
        self::setDate($date, 1);
        return $date;
    }

    /**
     * @param \DateTime $date
     * @param bool $force
     * @param bool $exact
     * @return \DateTime
     */
    static function switchToNextYear(\DateTime $date,$force = false,$exact = false)
    {
        if ($exact) {
            $date->modify('+1 year');
            return $date;
        }
        if ($force || (!(self::getMonth($date)=== 0 && self::getDate($date) === 1))) {
            $date->setDate((intval($date->format('Y'))+1), '1', '1');
        }
        return $date;
    }

    /**
     * @param \DateTime $date
     * @return \DateTime
     */
    static function rewindToDecadeFirst(\DateTime $date)
    {
        $date->setDate(floor(intval($date->format('Y')/10))*10, '1', '1');
        return $date;
    }

    /**
     * @param \DateTime $date
     * @param bool $force
     * @param bool $exact
     * @return \DateTime
     */
    static function switchToNextDecade(\DateTime $date,$force = false,$exact = false)
    {
        if ($exact) {
            $date->modify('+10 year');
            return $date;
        }
        $year = self::getYear($date);
        $decade = (floor($year / 10)) * 10;
        if ($force || (!(($year - $decade) === 0 && self::getMonth($date) === 0 && self::getDate($date) === 1))) {
            $date->setDate($decade+10, '1', '1');
        }
        return $date;
    }

    /**
     * @param \DateTime $date
     * @return \DateTime
     */
    static function rewindToCenturyFirst(\DateTime $date)
    {
        $date->setDate(floor(intval($date->format('Y')/100))*100, '1', '1');
        return $date;
    }

    /**
     * @param \DateTime $date
     * @param bool $force
     * @param bool $exact
     * @return \DateTime
     */
    static function switchToNextCentury(\DateTime $date,$force=false,$exact=false)
    {
        if ($exact){
            $date->modify('+100 year');
            return $date;
        }
        $year = self::getYear($date);
        $century = (floor($year / 100)) * 100;

        if($force ||  (! ( ($year-$century)===0 && self::getMonth($date) === 0 && self::getDate($date) === 1)) ){
            $date->setDate($century+100, '1', '1');
        }
        return $date;
    }

    /**
     * @param \DateTime $date
     * @return \DateTime
     */
    static function rewindToMilleniaFirst(\DateTime $date)
    {
        $date->setDate(floor(intval($date->format('Y')/1000))*1000, '1', '1');
        return $date;
    }

    /**
     * @param \DateTime $date
     * @param bool $force
     * @param bool $exact
     * @return \DateTime
     */
    static function switchToNextMillenia(\DateTime $date,$force=false,$exact=false)
    {
        if ($exact) {
            $date->modify('+1000 year');
            return $date;
        }
        $year = self::getYear($date);
        $millenia = (floor($year / 1000)) * 1000;

        if($force || (! ( ($year-$millenia)=== 0 && self::getMonth($date) === 0 && self::getDate($date) === 1)) ){
            $date->setDate($millenia+1000, '1', '1');
        }
        return $date;
    }
}