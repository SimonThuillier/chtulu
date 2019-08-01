<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 22:59
 */

namespace App\DTO;

use Symfony\Component\Serializer\Annotation\Groups;
use App\Mediator\DTOMediator;

class ArticleLinkDTO extends EntityMutableDTO
{
    /** @var string */
    protected $abstract;
    /** @var integer */
    protected $parentId;
    /** @var integer */
    protected $childId;
    /** @var ArticleDTO */
    protected $parent;
    /** @var ArticleDTO */
    protected $child;
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
    public function getAbstract()
    {
        return $this->abstract;
    }

    /**
     * @param string $abstract
     * @return self
     */
    public function setAbstract($abstract)
    {
        $this->abstract= $abstract;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('abstract');
        return $this;
    }

    /**
     * @return int
     * @Groups({"minimal"})
     */
    public function getParentId(): ?int
    {
        return $this->parentId;
    }

    /**
     * @param int $parentId
     * @return ArticleLinkDTO
     */
    public function setParentId(int $parentId): ArticleLinkDTO
    {
        $this->parentId = $parentId;
        return $this;
    }

    /**
     * @return int
     * @Groups({"minimal"})
     */
    public function getChildId(): ?int
    {
        return $this->childId;
    }

    /**
     * @param int $childId
     * @return ArticleLinkDTO
     */
    public function setChildId(int $childId): ArticleLinkDTO
    {
        $this->childId = $childId;
        return $this;
    }

    /**
     * @return ArticleDTO
     * @Groups({"parent"})
     */
    public function getParent(): ?ArticleDTO
    {
        return $this->parent;
    }

    /**
     * @param ArticleDTO $parent
     * @return ArticleLinkDTO
     */
    public function setParent(ArticleDTO $parent): ArticleLinkDTO
    {
        if($this->parent !== $parent){
            $this->parent = $parent;
            if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('parent');
        }
        return $this;
    }

    /**
     * @return ArticleDTO
     * @Groups({"child"})
     */
    public function getChild(): ?ArticleDTO
    {
        return $this->child;
    }

    /**
     * @param ArticleDTO $child
     * @return ArticleLinkDTO
     */
    public function setChild(ArticleDTO $child): ArticleLinkDTO
    {
        if($this->child !== $child){
            $this->child = $child;
            if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('child');
        }
        return $this;
    }
}