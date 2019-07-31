<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ArticleLink
 *
 * @ORM\Table(name="hb_article_link")
 * @ORM\Entity(repositoryClass="App\Repository\ArticleLinkRepository")
 */
class ArticleLink
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="bigint")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;
    
    /**
     * @var Article
     * @ORM\ManyToOne(targetEntity="Article",inversedBy="links")
     * @ORM\JoinColumn(name="parent_article_id", referencedColumnName="id")
     */
    private $parent;
    
    /**
     * @var Article
     * @ORM\ManyToOne(targetEntity="Article")
     * @ORM\JoinColumn(name="child_article_id", referencedColumnName="id")
     */
    private $child;

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
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="edition_user_id", referencedColumnName="id")
     */
    protected $editionUser;

    /**
     * @var \DateTime
     * @ORM\Column(name="edition_date", type="datetime")
     */
    protected $editionDate;

    /**
     * @var boolean
     * @ORM\Column(name="active", type="boolean")
     */
    protected $active;

    /**
     * @var string
     * @ORM\Column(name="abstract", type="string", length=2000)
     */
    protected $abstract;

    /**
     * @var float
     * @ORM\Column(name="y", type="float")
     */
    private $y;


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
     * Get parent
     * @return article
     */
    public function getParent(){
        return $this->parent;
    }

    /**
     * Set parent
     * @param Article $parent
     * @return ArticleLink
     */
    public function setParent($parent){
        $this->parent = $parent;
        return $this;
    }

    /**
     * Get child
     * @return Article
     */
    public function getChild(){
        return $this->child;
    }

    /**
     * Set child
     * @param Article $child
     * @return ArticleLink
     */
    public function setChild($child){
        $this->child = $child;
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
     * @return ArticleLink
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
     * @return ArticleLink
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
     * @return ArticleLink
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
     * @return ArticleLink
     */
    public function setEditionDate($editionDate){
        $this->editionDate = $editionDate;
        return $this;
    }

    /**
     * @return bool
     */
    public function getActive(): bool
    {
        return $this->active;
    }

    /**
     * @param bool $active
     * @return ArticleLink
     */
    public function setActive(bool $active): ArticleLink
    {
        $this->active = $active;
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
     * @return ArticleLink
     */
    public function setAbstract($abstract){
        $this->abstract = $abstract;
        return $this;
    }

    /**
     * Set y
     * @param float $y
     * @return ArticleLink
     */
    public function setY($y){
        $this->y = $y;

        return $this;
    }

    /**
     * Get y
     * @return float
     */
    public function getY(){
        return $this->y;
    }

}

