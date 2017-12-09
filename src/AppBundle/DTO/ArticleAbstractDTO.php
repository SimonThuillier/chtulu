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
    /** @var boolean
     * @Groups("group1") */
    public $hasNotEndDate;
    /** @var string
     * @Groups("group1") */
    public $endDateLabel;
    /** @var HDate */
    protected $beginHDate;
    /** @var integer */
    protected $beginDateMinIndex;
    /** @var integer */
    protected $beginDateMaxIndex;
    /** @var DateType */
    protected $beginDateType;
    /** @var HDate */
    protected $endHDate;
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

}