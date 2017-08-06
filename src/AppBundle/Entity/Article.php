<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Article
 *
 * @ORM\Table(name="article")
 * @ORM\Entity(repositoryClass="EntityBundle\Repository\ArticleRepository")
 */
class Article
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
     * @ORM\Column(name="title", type="string", length=128)
     */
    private $title;
    
    /**
     * @var string
     *
     * @ORM\Column(name="abstract", type="string", length=255)
     */
    private $abstract;

    /**
     * @var string
     *
     * @ORM\Column(name="content", type="text", nullable=true)
     */
    private $content;

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
     * @return Article
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
     * Set beginMinDate
     *
     * @param \DateTime $beginMinDate
     *
     * @return Article
     */
    public function setBeginMinDate($beginMinDate)
    {
        $this->beginMinDate = $beginMinDate;

        return $this;
    }

    /**
     * Get beginMinDate
     *
     * @return \DateTime
     */
    public function getBeginMinDate()
    {
        return $this->beginMinDate;
    }

    /**
     * Set beginMaxDate
     *
     * @param \DateTime $beginMaxDate
     *
     * @return Article
     */
    public function setBeginMaxDate($beginMaxDate)
    {
        $this->beginMaxDate = $beginMaxDate;

        return $this;
    }

    /**
     * Get beginMaxDate
     *
     * @return \DateTime
     */
    public function getBeginMaxDate()
    {
        return $this->beginMaxDate;
    }
    
    

    /**
     * Set content
     *
     * @param string $content
     *
     * @return Article
     */
    public function setContent($content)
    {
        $this->content = $content;

        return $this;
    }

    /**
     * Get content
     *
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Set userCreationId
     *
     * @param integer $userCreationId
     *
     * @return Article
     */
    public function setUserCreationId($userCreationId)
    {
        $this->userCreationId = $userCreationId;

        return $this;
    }

    /**
     * Get userCreationId
     *
     * @return int
     */
    public function getUserCreationId()
    {
        return $this->userCreationId;
    }

    /**
     * Set creationDate
     *
     * @param \DateTime $creationDate
     *
     * @return Article
     */
    public function setCreationDate($creationDate)
    {
        $this->creationDate = $creationDate;

        return $this;
    }

    /**
     * Get creationDate
     *
     * @return \DateTime
     */
    public function getCreationDate()
    {
        return $this->creationDate;
    }

    /**
     * Set userEditionId
     *
     * @param integer $userEditionId
     *
     * @return Article
     */
    public function setUserEditionId($userEditionId)
    {
        $this->userEditionId = $userEditionId;

        return $this;
    }

    /**
     * Get userEditionId
     *
     * @return int
     */
    public function getUserEditionId()
    {
        return $this->userEditionId;
    }

    /**
     * Set editionDate
     *
     * @param \DateTime $editionDate
     *
     * @return Article
     */
    public function setEditionDate($editionDate)
    {
        $this->editionDate = $editionDate;

        return $this;
    }

    /**
     * Get editionDate
     *
     * @return \DateTime
     */
    public function getEditionDate()
    {
        return $this->editionDate;
    }

    /**
     * id
     * @param unkown $id
     * @return Article
     */
    public function setId($id){
        $this->id = $id;
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
     * @return Article
     */
    public function setAbstract($abstract){
        $this->abstract = $abstract;
        return $this;
    }

}

