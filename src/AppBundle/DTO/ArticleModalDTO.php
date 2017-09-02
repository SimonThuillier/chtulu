<?php

namespace AppBundle\DTO;

use AppBundle\Entity\ArticleType;
use AppBundle\Entity\ArticleSubType;


/**
 * 
 * @author belze
 * DTO for handling article form and mapping with entities (Article,...)
 */
class ArticleModalDTO implements ArticleDTOInterface
{
    /** @var string */
    private $title;
    /** @var ArticleType */
    private $type;
    /** @var ArticleSubType */
    private $subType;
    /** @var string */
    private $abstract;
    /** @var \DateTime */
    private $beginDate;
    /** @var \DateTime */
    private $minBeginDate;
    /** @var \DateTime */
    private $maxBeginDate;
    /** @var boolean */
    private $isBeginDateApprox;
    /** @var boolean */
    private $hasNotEndDate;
    /** @var \DateTime */
    private $endDate;
    /** @var \DateTime */
    private $minEndDate;
    /** @var \DateTime */
    private $maxEndDate;
    /** @var boolean */
    private $isEndDateApprox;

    /**
     * title
     * @return string
     */
    public function getTitle(){
        return $this->title;
    }

    /**
     * title
     * @param string $title
     * @return self
     */
    public function setTitle($title){
        $this->title = $title;
        return $this;
    }

    /**
     * type
     * @return ArticleType
     */
    public function getType(){
        return $this->type;
    }

    /**
     * type
     * @param ArticleType $type
     * @return self
     */
    public function setType($type){
        $this->type = $type;
        return $this;
    }

    /**
     * subType
     * @return ArticleSubType
     */
    public function getSubType(){
        return $this->subType;
    }

    /**
     * subType
     * @param ArticleSubType $subType
     * @return self
     */
    public function setSubType($subType){
        $this->subType = $subType;
        return $this;
    }

    /**
     * abstract
     * @return string
     */
    public function getAbstract(){
        return $this->abstract;
    }

    /**
     * abstract
     * @param string $abstract
     * @return self
     */
    public function setAbstract($abstract){
        $this->abstract = $abstract;
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
     * beginDate
     * @param \DateTime $beginDate
     * @return self
     */
    public function setBeginDate($beginDate){
        $this->beginDate = $beginDate;
        return $this;
    }

    /**
     * minBeginDate
     * @return \DateTime
     */
    public function getMinBeginDate(){
        return $this->minBeginDate;
    }

    /**
     * minBeginDate
     * @param \DateTime $minBeginDate
     * @return self
     */
    public function setMinBeginDate($minBeginDate){
        $this->minBeginDate = $minBeginDate;
        return $this;
    }

    /**
     * maxBeginDate
     * @return \DateTime
     */
    public function getMaxBeginDate(){
        return $this->maxBeginDate;
    }

    /**
     * maxBeginDate
     * @param \DateTime $maxBeginDate
     * @return self
     */
    public function setMaxBeginDate($maxBeginDate){
        $this->maxBeginDate = $maxBeginDate;
        return $this;
    }

    /**
     * isBeginDateApprox
     * @return boolean
     */
    public function getIsBeginDateApprox(){
        return $this->isBeginDateApprox;
    }

    /**
     * isBeginDateApprox
     * @param boolean $isBeginDateApprox
     * @return self
     */
    public function setIsBeginDateApprox($isBeginDateApprox){
        $this->isBeginDateApprox = $isBeginDateApprox;
        return $this;
    }
    
    /**
     * hasNotEndDate
     * @return boolean
     */
    public function getHasNotEndDate(){
        return $this->hasNotEndDate;
    }
    
    /**
     * hasNotEndDate
     * @param boolean $hasNotEndDate
     * @return self
     */
    public function setHasNotEndDate($hasNotEndDate){
        $this->hasNotEndDate = $hasNotEndDate;
        return $this;
    }
    
    /**
     * endDate
     * @return \DateTime
     */
    public function getEndDate(){
        return $this->beginDate;
    }
    
    /**
     * endDate
     * @param \DateTime $endDate
     * @return self
     */
    public function setEndDate($endDate){
        $this->endDate = $endDate;
        return $this;
    }
    
    /**
     * minEndDate
     * @return \DateTime
     */
    public function getMinEndDate(){
        return $this->minEndDate;
    }
    
    /**
     * minEndDate
     * @param \DateTime $minEndDate
     * @return self
     */
    public function setMinEndDate($minEndDate){
        $this->minEndDate = $minEndDate;
        return $this;
    }
    
    /**
     * maxEndDate
     * @return \DateTime
     */
    public function getMaxEndDate(){
        return $this->maxEndDate;
    }
    
    /**
     * maxEndDate
     * @param \DateTime $maxEndDate
     * @return self
     */
    public function setMaxEndDate($maxEndDate){
        $this->maxEndDate = $maxEndDate;
        return $this;
    }
    
    /**
     * isEndDateApprox
     * @return boolean
     */
    public function getIsEndDateApprox(){
        return $this->isEndDateApprox;
    }
    
    /**
     * isEndDateApprox
     * @param boolean $isEndDateApprox
     * @return self
     */
    public function setIsEndDateApprox($isEndDateApprox){
        $this->isEndDateApprox = $isEndDateApprox;
        return $this;
    }

}