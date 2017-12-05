<?php

/**
 * 
 */

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use AppBundle\DTO\ArticleMainDTO;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Article
 * @author Belze
 * @ORM\Table(name="hb_article")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ArticleRepository")
 * @UniqueEntity(fields="title", message="Another article named {{ value }} exists. Consider editing it instead or rename your article.")
 */
class Article extends AbstractBindableEntity
{
    /**
     * @var int
     * @ORM\Column(name="id", type="bigint")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     * @ORM\Column(name="title", type="string", length=50)
     */
    protected $title;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User",inversedBy="createdArticles")
     * @ORM\JoinColumn(name="creation_user_id", referencedColumnName="id")
     */
    protected $creationUser;

    /**
     * @var \DateTime
     * @ORM\Column(name="creation_date", type="datetime")
     */
    protected $creationDate;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User",inversedBy="editedArticles")
     * @ORM\JoinColumn(name="edition_user_id", referencedColumnName="id")
     */
    protected $editionUser;

    /**
     * @var \DateTime
     * @ORM\Column(name="edition_date", type="datetime")
     */
    protected $editionDate;
    
    /**
     * @var string
     * @ORM\Column(name="abstract", type="string", length=2000)
     */
    protected $abstract;
    
    /**
     * @var ArticleType
     * @ORM\ManyToOne(targetEntity="ArticleType")
     * @ORM\JoinColumn(name="type_id", referencedColumnName="id")
     */
    protected $type;
    
    /**
     * @ORM\ManyToOne(targetEntity="ArticleSubType")
     * @ORM\JoinColumn(name="subtype_id", referencedColumnName="id")
     */
    protected $subType;
    
    /**
     * @var string
     * @ORM\Column(name="content", type="text", nullable=true)
     */
    protected $content;
    
    /**
     * @var integer
     * @ORM\Column(name="begin_begin_date_index", type="integer",nullable=true)
     */
    protected $beginBeginDateIndex;
    
    /**
     * @var integer
     * @ORM\Column(name="begin_end_date_index", type="date", nullable=true)
     */
    protected $beginEndDateIndex;
    
    /**
     * @var DateType
     * @ORM\ManyToOne(targetEntity="DateType")
     * @ORM\JoinColumn(name="begin_type", referencedColumnName="id", nullable=true)
     */
    protected $beginType;
    
    /**
     * @var string
     * @ORM\Column(name="begin_label", type="string", nullable=true,length=50)
     */
    protected $beginLabel;
    
    /**
     * @var integer
     * @ORM\Column(name="end_begin_date_index", type="integer",nullable=true)
     */
    protected $endBeginDateIndex;
    
    /**
     * @var integer
     * @ORM\Column(name="end_end_date_index", type="date", nullable=true)
     */
    protected $endEndDateIndex;
    
    /**
     * @var DateType
     * @ORM\ManyToOne(targetEntity="DateType")
     * @ORM\JoinColumn(name="end_type", referencedColumnName="id", nullable=true)
     */
    protected $endType;
    
    /**
     * @var string
     * @ORM\Column(name="end_label", type="string", nullable=true,length=50)
     */
    protected $endLabel;
    
    /**
     * @var array
     * @ORM\Column(name="domain", type="simple_array",nullable=true)
     */
    protected $domain=array(0,0,0,0,0,0,0,0); // all 0 by default
    
    /**
     * @var ArrayCollection
     * @ORM\OneToMany(targetEntity="ArticleLink", mappedBy="parentArticle")
     */
    protected $links;
    
    
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
        if($creationDate > new \DateTime()){
            throw new \Exception('Entering dates after the actual date is not allowed; This is history, not science fiction !');
        }
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
        if($editionDate > new \DateTime()){
            throw new \Exception('Entering dates after the actual date is not allowed; This is history, not science fiction !');
        }
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
        if($minBeginDate > new \DateTime()){
            throw new \Exception('Entering dates after the actual date is not allowed; This is history, not science fiction !');
        }
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
        if($maxBeginDate > new \DateTime()){
            throw new \Exception('Entering dates after the actual date is not allowed; This is history, not science fiction !');
        }
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
        if($minEndDate > new \DateTime()){
            throw new \Exception('Entering dates after the actual date is not allowed; This is history, not science fiction !');
        }
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
        if($maxEndDate > new \DateTime()){
            throw new \Exception('Entering dates after the actual date is not allowed; This is history, not science fiction !');
        }
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
    
    


    /**
     * domain
     * @param string $domain
     * @return Article
     */
    public function setDomain($domain){
        $this->domain = $domain;
        return $this;
    }

    /**
     * Get links
     * @return ArrayCollection
     */
    public function getLinks(){
        return $this->links;
    }

    /**
     * Add links
     * @param ArticleLink $link
     * @return self
     */
    public function addLink($link){
        $this->links[] = $link;
        return $this;
    }

}

