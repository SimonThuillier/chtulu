<?php

namespace AppBundle\DTO;

use AppBundle\Entity\ArticleType;
use AppBundle\Entity\ArticleSubType;
use Symfony\Component\Serializer\Annotation\Groups;

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
    public $beginDateLabel;
    /** @var string
     * @Groups("group1") */
    public $endDateLabel;
    /** @var HDate */
    public $beginHDate;
    /** @var integer */
    protected $beginDateMinIndex;
    /** @var integer */
    protected $beginDateMaxIndex;
    /** @var DateType */
    protected $beginDateType;
    /** @var boolean
     * @Groups("group1") */
    protected $hasEndDate = true;
    /** @var HDate */
    public $endHDate;
    /** @var integer */
    protected $endDateMinIndex;
    /** @var integer */
    protected $endDateMaxIndex;
    /** @var DateType */
    protected $endDateType; 
    
    
    /**
     * beginDateLabel
     * @return string
     */
    public function getBeginDateLabel(){
        return $this->beginDateLabel;
    }

    /**
     * endDateLabel
     * @return string
     */
    public function getEndDateLabel(){
        return $this->endDateLabel;
    }
    
    public function getHasEndDate(){
        if ($this->title == null) return true;
        return $this->endHDate !== null;
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
}