<?php

/**
 *
 */

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use AppBundle\DTO\ArticleMainDTO;
use Doctrine\Common\Collections\ArrayCollection;
use AppBundle\Utils\HDate;
use AppBundle\Helper\DateHelper;

/**
 * Article
 * @author Belze
 * @ORM\Table(name="hb_article")
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
     * @var string
     * @ORM\Column(name="content", type="text", nullable=true)
     */
    protected $content;

    /**
     * @var HDate
     */
    protected $beginHDate;

    /**
     * @var integer
     * @ORM\Column(name="begin_date_min_index", type="integer",nullable=true)
     */
    protected $beginDateMinIndex;

    /**
     * @var integer
     * @ORM\Column(name="begin_date_max_index", type="integer", nullable=true)
     */
    protected $beginDateMaxIndex;

    /**
     * @var DateType
     * @ORM\ManyToOne(targetEntity="DateType")
     * @ORM\JoinColumn(name="begin_date_type", referencedColumnName="id", nullable=true)
     */
    protected $beginDateType;

    /**
     * @var string
     * @ORM\Column(name="begin_date_label", type="string", nullable=true,length=50)
     */
    protected $beginDateLabel;

    /**
     * @var HDate
     */
    protected $endHDate;

    /**
     * @var integer
     * @ORM\Column(name="end_date_min_index", type="integer",nullable=true)
     */
    protected $endDateMinIndex;

    /**
     * @var integer
     * @ORM\Column(name="end_date_max_index", type="integer", nullable=true)
     */
    protected $endDateMaxIndex;

    /**
     * @var DateType
     * @ORM\ManyToOne(targetEntity="DateType")
     * @ORM\JoinColumn(name="end_date_type", referencedColumnName="id", nullable=true)
     */
    protected $endDateType;

    /**
     * @var string
     * @ORM\Column(name="end_date_label", type="string", nullable=true,length=50)
     */
    protected $endDateLabel;

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

    public function __toString()
    {
        return $this->title;
    }


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
     * get beginHDate
     * @return HDate|null
     */
    public function getBeginHDate(){
        if($this->beginHDate === null && $this->beginDateType !== null){
            $this->beginHDate = new HDate();
            $this->beginHDate
                ->setType($this->beginDateType)
                ->setBeginDate(DateHelper::indexToDate($this->beginDateMinIndex))
                ->setEndDate(DateHelper::indexToDate($this->beginDateMaxIndex))
                ->updateIndexes();
        }
        return $this->beginHDate;
    }

    /**
     * Set beginHDate
     * @param HDate $hDate
     * @return Article
     */
    public function setBeginHDate($hDate){
        $this->beginHDate = $hDate;
        if($this->beginHDate === null){
            $this->beginDateLabel = null;
            $this->beginDateMinIndex = null;
            $this->beginDateMaxIndex = null;
            $this->beginDateType = null;
        }
        else{
            $this->beginDateLabel = $hDate->getLabel();
            $this->beginDateMinIndex = DateHelper::dateToIndex($hDate->getBeginDate());
            $this->beginDateMaxIndex = DateHelper::dateToIndex($hDate->getEndDate());
            $this->beginDateType = $hDate->getType();
        }
        return $this;
    }

    /**
     * get endHDate
     * @return HDate|null
     */
    public function getEndHDate(){
        if($this->endHDate === null && $this->endDateType !== null){
            $this->endHDate = new HDate();
            $this->endHDate
                ->setType($this->endDateType)
                ->setBeginDate(DateHelper::indexToDate($this->endDateMinIndex))
                ->setEndDate(DateHelper::indexToDate($this->endDateMaxIndex))
                ->updateIndexes();
        }

        return $this->endHDate;
    }

    /**
     * Set endHDate
     * @param HDate $hDate
     * @return Article
     */
    public function setEndHDate($hDate){
        $this->endHDate = $hDate;
        if($this->endHDate === null){
            $this->endDateLabel = null;
            $this->endDateMinIndex = null;
            $this->endDateMaxIndex = null;
            $this->endDateType = null;
        }
        else{
            $this->endDateLabel = $hDate->getLabel();
            $this->endDateMinIndex = DateHelper::dateToIndex($hDate->getBeginDate());
            $this->endDateMaxIndex = DateHelper::dateToIndex($hDate->getEndDate());
            $this->endDateType = $hDate->getType();
        }
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

