<?php

namespace AppBundle\DTO;

use AppBundle\Entity\ArticleType;
use AppBundle\Entity\ArticleSubType;
use Symfony\Component\Serializer\Annotation\Groups;
use AppBundle\Helper\DateHelper;
use AppBundle\Utils\HDate;
use AppBundle\Entity\DateType;

/**
 * 
 * @author belze
 * DTO for handling article form and mapping with entities (Article,...)
 */
abstract class ArticleAbstractDTO
{
    public function __construct()
    {
    }  
    
    /** @var string 
     * @Groups("group1")
     */
    public $title;
    /** @var ArticleType 
     * @Groups("group1") 
     */
    public $type;
    /** @var ArticleSubType 
     @Groups("group1") 
     */
    public $subType;
    /** @var string
    * @Groups("group1") 
    */
    public $abstract;
    /** @var string
     * @Groups("group1") */
    
    /** @var HDate */
    protected $beginHDate;
    /** @var string
     * @Groups("group1") */
    protected $beginDateLabel;
    
    /** @var boolean
     * @Groups("group1") */
    protected $hasEndDate = true;
    /** @var HDate */
    protected $endHDate;
    /** @var string
     * @Groups("group1") */
    protected $endDateLabel;
    
    /**
     * get beginDateLabel
     * @return string
     */
    public function getBeginDateLabel(){
        return $this->beginDateLabel;
    }
    
    /**
     * beginDateLabel
     * @param string $beginDateLabel
     * @return ArticleAbstractDTO
     */
    public function setBeginDateLabel($beginDateLabel){
        $this->beginDateLabel = $beginDateLabel;
        return $this;
    }
    

    /**
     * get endDateLabel
     * @return string
     */
    public function getEndDateLabel(){
        return $this->endDateLabel;
    }
    
    /**
     * endDateLabel
     * @param string $endDateLabel
     * @return ArticleAbstractDTO
     */
    public function setEndDateLabel($endDateLabel){
        $this->endDateLabel = $endDateLabel;
        return $this;
    }
    
    /**
     * 
     * @return boolean
     */
    public function getHasEndDate(){
        if ($this->title == null) return true;
        return $this->hasEndDate;
    }
    
    /**
     * 
     * @param boolean $hasEndDate
     * @return self
     */
    public function setHasEndDate($hasEndDate){
        $this->hasEndDate = $hasEndDate;
        if(!$this->hasEndDate){
            $this->endHDate = null;
            $this->endDateLabel = null;
        }
    }
    
    /**
     * beginHDate
     * @return HDate
     */
    public function getBeginHDate(){
        return $this->beginHDate;
    }

    /**
     * beginHDate
     * @param HDate $beginHDate
     * @return ArticleAbstractDTO
     */
    public function setBeginHDate($beginHDate){
        $this->beginHDate = $beginHDate;
        return $this;
    }

    /**
     * endHDate
     * @return HDate
     */
    public function getEndHDate(){
        return $this->endHDate;
    }

    /**
     * endHDate
     * @param HDate $endHDate
     * @return ArticleAbstractDTO
     */
    public function setEndHDate($endHDate){
        $this->endHDate = $endHDate;
        return $this;
    }

}