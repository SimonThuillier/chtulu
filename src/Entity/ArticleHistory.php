<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ArticleHistory
 *
 * @ORM\Table(name="hb_article_history")
 * @ORM\Entity(repositoryClass="App\Repository\ArticleHistoryRepository")
 */
class ArticleHistory extends DTOMutableEntity
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
     * @ORM\ManyToOne(targetEntity="Article")
     * @ORM\JoinColumn(name="article_id", referencedColumnName="id",nullable=false)
     */
    private $article;

    /**
     * @var ArticleStatus
     * @ORM\ManyToOne(targetEntity="ArticleStatus")
     * @ORM\JoinColumn(name="article_status_id", referencedColumnName="id",nullable=false)
     */
    private $status;

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
     * @ORM\Column(name="message", type="string", length=2000,nullable=true)
     */
    protected $message;

    /**
     * Get id
     *
     * @return int
     */
    public function getId() : ?int
    {
        return $this->id;
    }

    /**
     * @return Article
     */
    public function getArticle(): Article
    {
        return $this->article;
    }

    /**
     * @param Article $article
     * @return ArticleHistory
     */
    public function setArticle(Article $article): ArticleHistory
    {
        $this->article = $article;
        return $this;
    }

    /**
     * @return ArticleStatus
     */
    public function getStatus(): ArticleStatus
    {
        return $this->status;
    }

    /**
     * @param ArticleStatus $status
     * @return ArticleHistory
     */
    public function setStatus(ArticleStatus $status): ArticleHistory
    {
        $this->status = $status;
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
     * @return ArticleHistory
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
     * @return ArticleHistory
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
     * @return ArticleHistory
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
     * @return ArticleHistory
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
     * @return ArticleHistory
     */
    public function setActive(bool $active): ArticleHistory
    {
        $this->active = $active;
        return $this;
    }

    /**
     * Get message
     * @return string
     */
    public function getMessage(){
        return $this->message;
    }

    /**
     * Set message
     * @param string $message
     * @return ArticleHistory
     */
    public function setMessage($message){
        $this->message = $message;
        return $this;
    }
}

