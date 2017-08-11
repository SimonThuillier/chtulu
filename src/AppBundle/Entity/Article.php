<?php

/**
 * 
 */

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * Article
 * @author Belze
 * @ORM\Table(name="article")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ArticleRepository")
 * @UniqueEntity(fields="title", message="Another article named {{ value }} exists. Consider editing it instead or rename your article.")
 */
class Article
{
    /**
     * @var int
     * @ORM\Column(name="id", type="bigint")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     * @ORM\Column(name="title", type="string", length=50)
     */
    private $title;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User",inversedBy="createdArticles")
     * @ORM\JoinColumn(name="creation_user_id", referencedColumnName="id")
     */
    private $creationUser;

    /**
     * @var \DateTime
     * @ORM\Column(name="creation_date", type="datetime")
     */
    private $creationDate;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User",inversedBy="editedArticles")
     * @ORM\JoinColumn(name="edition_user_id", referencedColumnName="id")
     */
    private $editionUser;

    /**
     * @var \DateTime
     * @ORM\Column(name="edition_date", type="datetime")
     */
    private $editionDate;
    
    /**
     * @var string
     * @ORM\Column(name="abstract", type="string", length=255)
     */
    private $abstract;
    
    /**
     * @var ArticleType
     * @ORM\ManyToOne(targetEntity="ArticleType")
     * @ORM\JoinColumn(name="type_id", referencedColumnName="id")
     */
    private $type;
    
    /**
     * @ORM\ManyToOne(targetEntity="ArticleSubType")
     * @ORM\JoinColumn(name="subtype_id", referencedColumnName="id")
     */
    private $subType;
    
    /**
     * @var string
     * @ORM\Column(name="content", type="text", nullable=true)
     */
    private $content;
    
    /**
     * @var \DateTime
     * @ORM\Column(name="min_begin_date", type="date",nullable=true)
     */
    private $minBeginDate;
    
    /**
     * @var \DateTime
     * @ORM\Column(name="max_begin_date", type="date", nullable=true)
     */
    private $maxBeginDate;
    
    /**
     * @var \DateTime
     * @ORM\Column(name="min_end_date", type="date", nullable=true)
     */
    private $minEndDate;
    
    /**
     * @var \DateTime
     * @ORM\Column(name="max_end_date", type="date", nullable=true)
     */
    private $maxEndDate;
    
    /**
     * @var array
     * @ORM\Column(name="domain", type="simple_array",nullable=true)
     */
    private $domain=array(0,0,0,0,0,0,0,0); // all 0 by default
    
    
    /**
     * Get id
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Get title
     * @return string
     */
    public function getTitle(){
        return $this->title;
    }

    /**
     * Set title
     * @param string $title
     * @return Article
     */
    public function setTitle($title){
        $this->title = $title;
        return $this;
    }

    /**
     * Get creationUser
     * @return User
     */
    public function getCreationUser(){
        return $this->creationUser;
    }

    /**
     * Set creationUser
     * @param User $creationUser
     * @return Article
     */
    public function setCreationUser($creationUser){
        $this->creationUser = $creationUser;
        return $this;
    }

    /**
     * Get creationDate
     * @return \DateTime
     */
    public function getCreationDate(){
        return $this->creationDate;
    }

    /**
     * Set creationDate
     * @param \DateTime $creationDate
     * @return Article
     */
    public function setCreationDate($creationDate){
        $this->creationDate = $creationDate;
        return $this;
    }

    /**
     * Get editionUser
     * @return User
     */
    public function getEditionUser(){
        return $this->editionUser;
    }

    /**
     * Set editionUser
     * @param User $editionUser
     * @return Article
     */
    public function setEditionUser($editionUser){
        $this->editionUser = $editionUser;
        return $this;
    }

    /**
     * Get editionDate
     * @return \DateTime
     */
    public function getEditionDate(){
        return $this->editionDate;
    }

    /**
     * Set editionDate
     * @param \DateTime $editionDate
     * @return Article
     */
    public function setEditionDate($editionDate){
        $this->editionDate = $editionDate;
        return $this;
    }

    /**
     * Get abstract
     * @return string
     */
    public function getAbstract(){
        return $this->abstract;
    }

    /**
     * Set abstract
     * @param string $abstract
     * @return Article
     */
    public function setAbstract($abstract){
        $this->abstract = $abstract;
        return $this;
    }

    /**
     * Get type
     * @return ArticleType
     */
    public function getType(){
        return $this->type;
    }

    /**
     * Set type
     * @param ArticleType $type
     * @return Article
     */
    public function setType($type){
        $this->type = $type;
        return $this;
    }

    /**
     * Get subType
     * @return ArticleSubType
     */
    public function getSubType(){
        return $this->subType;
    }

    /**
     * Set subType
     * @param ArticleSubType $subType
     * @return Article
     */
    public function setSubType($subType){
        $this->subType = $subType;
        return $this;
    }

    /**
     * Get content
     * @return string
     */
    public function getContent(){
        return $this->content;
    }

    /**
     * Set content
     * @param string $content
     * @return Article
     */
    public function setContent($content){
        $this->content = $content;
        return $this;
    }

    /**
     * Get minBeginDate
     * @return \DateTime
     */
    public function getMinBeginDate(){
        return $this->minBeginDate;
    }

    /**
     * Set minBeginDate
     * @param \DateTime $minBeginDate
     * @return Article
     */
    public function setMinBeginDate($minBeginDate){
        $this->minBeginDate = $minBeginDate;
        return $this;
    }

    /**
     * Get maxBeginDate
     * @return \DateTime
     */
    public function getMaxBeginDate(){
        return $this->maxBeginDate;
    }

    /**
     * Set maxBeginDate
     * @param \DateTime $maxBeginDate
     * @return Article
     */
    public function setMaxBeginDate($maxBeginDate){
        $this->maxBeginDate = $maxBeginDate;
        return $this;
    }

    /**
     * Get minEndDate
     * @return \DateTime
     */
    public function getMinEndDate(){
        return $this->minEndDate;
    }

    /**
     * Set minEndDate
     * @param \DateTime $minEndDate
     * @return Article
     */
    public function setMinEndDate($minEndDate){
        $this->minEndDate = $minEndDate;
        return $this;
    }

    /**
     * Get maxEndDate
     * @return \DateTime
     */
    public function getMaxEndDate(){
        return $this->maxEndDate;
    }

    /**
     * Set maxEndDate
     * @param \DateTime $maxEndDate
     * @return Article
     */
    public function setMaxEndDate($maxEndDate){
        $this->maxEndDate = $maxEndDate;
        return $this;
    }

    /**
     * Get domain
     * @return array
     */
    public function getDomain(){
        return $this->domain;
    }

}

