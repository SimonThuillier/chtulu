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
    private $parentArticle;
    
    /**
     * @var Article
     * @ORM\ManyToOne(targetEntity="Article")
     * @ORM\JoinColumn(name="child_article_id", referencedColumnName="id")
     */
    private $childArticle;

    /**
     * @var float
     *
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
     * Set y
     * @param float $y
     * @return ArticleLink
     */
    public function setY($y)
    {
        $this->y = $y;

        return $this;
    }

    /**
     * Get y
     * @return float
     */
    public function getY()
    {
        return $this->y;
    }

    /**
     * Get parentArticle
     * @return article
     */
    public function getParentArticle(){
        return $this->parentArticle;
    }

    /**
     * Set parentArticle
     * @param Article $parentArticle
     * @return ArticleLink
     */
    public function setParentArticle($parentArticle){
        $this->parentArticle = $parentArticle;
        return $this;
    }

    /**
     * Get childArticle
     * @return Article
     */
    public function getChildArticle(){
        return $this->childArticle;
    }

    /**
     * Set childArticle
     * @param Article $childArticle
     * @return ArticleLink
     */
    public function setChildArticle($childArticle){
        $this->childArticle = $childArticle;
        return $this;
    }

}

