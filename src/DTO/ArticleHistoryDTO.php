<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 22:59
 */

namespace App\DTO;

use App\Entity\ArticleStatus;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Mediator\DTOMediator;

class ArticleHistoryDTO extends EntityMutableDTO
{
    /** @var ArticleDTO */
    protected $article;
    /** @var int */
    protected $articleId;
    /** @var ArticleStatus */
    protected $status;
    /** @var string */
    protected $message;
    /** @var boolean */
    protected $active;
    /** @var \DateTime */
    protected $editionDate;
    /** @var DTOMediator */
    protected $mediator;

    /**
     * ArticleDTO constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @return string
     * @Groups({"minimal"})
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * @param string $message
     * @return self
     */
    public function setMessage($message)
    {
        $this->message= $message;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('message');
        return $this;
    }

    /**
     * @return string
     * @Groups({"minimal"})
     */
    public function getActive()
    {
        return $this->active;
    }

    /**
     * @param boolean $active
     * @return self
     */
    public function setActive($active)
    {
        $this->active= $active;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('active');
        return $this;
    }

    /**
     * @return int
     * @Groups({"minimal"})
     */
    public function getArticleId(): ?int
    {
        return $this->articleId;
    }

    /**
     * @param int $articleId
     * @return ArticleHistoryDTO
     */
    public function setArticleId(?int $articleId): ArticleHistoryDTO
    {
        $this->articleId = $articleId;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('articleId');
        return $this;
    }

    /**
     * @return ArticleStatus
     * @Groups({"minimal"})
     */
    public function getStatus(): ?ArticleStatus
    {
        return $this->status;
    }

    /**
     * @param ArticleStatus $status
     * @return ArticleHistoryDTO
     */
    public function setStatus(?ArticleStatus $status): ArticleHistoryDTO
    {
        $this->status = $status;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('status');
        return $this;
    }

    /**
     * @return \DateTime
     * @Groups({"minimal"})
     */
    public function getEditionDate(): ?\DateTime
    {
        return $this->editionDate;
    }

    /**
     * @param \DateTime $editionDate
     * @return ArticleHistoryDTO
     */
    public function setEditionDate(?\DateTime $editionDate): ArticleHistoryDTO
    {
        $this->editionDate = $editionDate;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('editionDate');
        return $this;
    }



    /**
     * @return ArticleDTO|null
     * @Groups({"article"})
     */
    public function getArticle(): ?ArticleDTO
    {
        return $this->article;
    }

    /**
     * @param ArticleDTO $article
     * @return ArticleHistoryDTO
     */
    public function setArticle(?ArticleDTO $article): ArticleHistoryDTO
    {
        $this->article = $article;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('article');
        return $this;
    }
}