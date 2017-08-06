<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Evolution
 *
 * @ORM\Table(name="evolution")
 * @ORM\Entity(repositoryClass="EntityBundle\Repository\EvolutionRepository")
 */
class Evolution
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=64)
     */
    private $title;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="begin_date_min", type="date")
     */
    private $beginDateMin;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="begin_date_max", type="date", nullable=true)
     */
    private $beginDateMax=null;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="end_date_min", type="date", nullable=true)
     */
    private $endDateMin=null;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="end_date_max", type="date", nullable=true)
     */
    private $endDateMax=null;
    
    /**
     * @var array
     *
     * @ORM\Column(name="domain", type="simple_array")
     */
    private $domain=array(0,0,0,0,0,0,0,0); // all 0 by default
    
    /**
     * @var int
     *
     * @ORM\Column(name="user_creation_id", type="bigint", nullable=true)
     */
    private $userCreationId;
    
    /**
     * @var \DateTime
     *
     * @ORM\Column(name="creation_date", type="date")
     */
    private $creationDate;
    
    /**
     * @var int
     *
     * @ORM\Column(name="user_edition_id", type="bigint", nullable=true)
     */
    private $userEditionId;
    
    /**
     * @var \DateTime
     *
     * @ORM\Column(name="edition_date", type="date")
     */
    private $editionDate;
    
    
    /**
     * 
     * @var \Article
     * @ORM\ManyToOne(targetEntity="Article")
     * @ORM\JoinColumn(name="article_id", referencedColumnName="id")
     */
    private $article;
    
    // for the creation of element
    /**
     * @var string
     * @Assert\Length(
     *      min = 0,
     *      max = 512,
     *      minMessage = "Your first name must be at least {{ limit }} characters long",
     *      maxMessage = "Your first name cannot be longer than {{ limit }} characters"
     * )
     */
    private $bufferAbstract;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return Evolution
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set beginnDateMin
     *
     * @param \DateTime $beginDateMin
     *
     * @return Evolution
     */
    public function setBeginDateMin($beginDateMin)
    {
        $this->beginDateMin = $beginDateMin;

        return $this;
    }

    /**
     * Get beginDateMin
     *
     * @return \DateTime
     */
    public function getBeginDateMin()
    {
        return $this->beginDateMin;
    }

    /**
     * Set beginDateMax
     *
     * @param \DateTime $beginDateMax
     *
     * @return Evolution
     */
    public function setBeginDateMax($beginDateMax)
    {
        $this->beginDateMax = $beginDateMax;

        return $this;
    }

    /**
     * Get beginDateMax
     *
     * @return \DateTime
     */
    public function getBeginDateMax()
    {
        return $this->beginDateMax;
    }

    /**
     * Set endDateMin
     *
     * @param \DateTime $endDateMin
     *
     * @return Evolution
     */
    public function setEndDateMin($endDateMin)
    {
        $this->endDateMin = $endDateMin;

        return $this;
    }

    /**
     * Get endDateMin
     *
     * @return \DateTime
     */
    public function getEndDateMin()
    {
        return $this->endDateMin;
    }

    /**
     * Set endDateMax
     *
     * @param \DateTime $endDateMax
     *
     * @return Evolution
     */
    public function setEndDateMax($endDateMax)
    {
        $this->endDateMax = $endDateMax;

        return $this;
    }

    /**
     * Get endDateMax
     *
     * @return \DateTime
     */
    public function getEndDateMax()
    {
        return $this->endDateMax;
    }
    
	public function getUserCreationId() {
		return $this->userCreationId;
	}
	
	public function setUserCreationId($userCreationId) {
		$this->userCreationId = $userCreationId;
		return $this;
	}
	
	public function getCreationDate() {
		return $this->creationDate;
	}
	
	public function setCreationDate(\DateTime $creationDate) {
		$this->creationDate = $creationDate;
		return $this;
	}
	
	public function getUserEditionId() {
		return $this->userEditionId;
	}
	
	public function setUserEditionId($userEditionId) {
		$this->userEditionId = $userEditionId;
		return $this;
	}
	public function getEditionDate() {
		return $this->editionDate;
	}
	
	public function setEditionDate(\DateTime $editionDate) {
		$this->editionDate = $editionDate;
		return $this;
	}
	
	public function getDomain() {
		return $this->domain;
	}
	
	public function setDomain(array $domain) {
		$this->domain = $domain;
		return $this;
	}

    /**
     * article
     * @return \Article
     */
    public function getArticle(){
        return $this->article;
    }

    /**
     * article
     * @param \Article $article
     * @return Evolution
     */
    public function setArticle($article){
        $this->article = $article;
        return $this;
    }
    
    /**
     * string
     * @return string
     */
    public function getArticleAbstract(){
    	return ($this->article !== null)?$this->article->getAbstract():"";
    }
    
    /**
     *      
     * @param string $param
     *
     * @return Evolution
     */
    public function setArticleAbstract($param){
    	if ($this->article !==null) $this->article->setAbstract($param);
    	else $this->bufferAbstract = $param;
    }
    
    /**
     * string
     * @return string
     */
    public function getBufferAbstract(){
    	return $this->bufferAbstract;
    }

}

