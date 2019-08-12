<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 22:59
 */

namespace App\DTO;

use Symfony\Component\Serializer\Annotation\Groups;
use App\Entity\ArticleType;
use App\Mediator\DTOMediator;
use App\Util\HDate;
use Symfony\Component\Validator\Constraints as Assert;
use App\Validator as HbAssert;

/**
 * @HbAssert\EndHDateSuperiorToBeginHDate()
 */
class ArticleDTO extends EntityMutableDTO
{
    /** @var string */
    protected $title;
    /** @var ArticleType */
    protected $type;
    /** @var integer */
    protected $firstRankLinksCount;
    /** @var integer */
    protected $secondRankLinksCount;
    /** @var string */
    protected $abstract;
    /** @var HDate */
    protected $beginHDate;
    /** @var HDate */
    protected $endHDate;
    /** @var boolean */
    protected $hasEndDate;
    /** @var mixed */
    protected $detailImageResource;
    /** @var ResourceGeometryDTO */
    protected $geometry;
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
     * @groups({"minimal"})
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param string $title
     * @return self
     */
    public function setTitle($title): ArticleDTO
    {
        $this->title = $title;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('title');
        return $this;
    }

    /**
     * @return ArticleType|null
     * @groups({"minimal"})
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param ArticleType $type
     * @return self
     */
    public function setType($type): ArticleDTO
    {
        $this->type = $type;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('type');
        return $this;
    }

    /**
     * @return int
     * @groups({"minimal"})
     */
    public function getFirstRankLinksCount(): int
    {
        return $this->firstRankLinksCount;
    }

    /**
     * @param int $firstRankLinksCount
     * @return ArticleDTO
     */
    public function setFirstRankLinksCount(int $firstRankLinksCount): ArticleDTO
    {
        if($firstRankLinksCount !== $this->firstRankLinksCount){
            if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('firstRankLinksCount');
            $this->firstRankLinksCount = $firstRankLinksCount;
        }
        return $this;
    }

    /**
     * @return int
     * @groups({"minimal"})
     */
    public function getSecondRankLinksCount(): int
    {
        return $this->secondRankLinksCount;
    }

    /**
     * @param int $secondRankLinksCount
     * @return ArticleDTO
     */
    public function setSecondRankLinksCount(int $secondRankLinksCount): ArticleDTO
    {
        if($secondRankLinksCount !== $this->secondRankLinksCount){
            if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('secondRankLinksCount');
            $this->secondRankLinksCount = $secondRankLinksCount;
        }
        return $this;
    }

    /**
     * @return string
     * @Groups({"abstract"})
     * @Assert\NotBlank()
     * @Assert\NotNull()
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
     * @return HDate
     * @Groups({"date"})
     */
    public function getBeginHDate():?HDate
    {
        return $this->beginHDate;
    }

    /**
     * @param HDate $hDate
     * @return self
     */
   public function setBeginHDate(?HDate $hDate)
    {
        $this->beginHDate=$hDate;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('beginHDate');
        return $this;
    }

    /**
     * @return HDate
     * @Groups({"date"})
     */
    public function getEndHDate():?HDate
    {
        return $this->endHDate;
    }

    /**
     * @param HDate $hDate
     * @return self
     */
    public function setEndHDate(?HDate $hDate)
    {
        $this->endHDate = $hDate;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('endHDate');
        return $this;
    }

    /**
     * @return boolean
     * @Groups({"date"})
     */
    public function getHasEndDate()
    {
        return $this->hasEndDate;
    }

    /**
     * @param bool $hasEndDate
     * @return self
     */
    public function setHasEndDate($hasEndDate)
    {
        $this->hasEndDate = $hasEndDate;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('hasEndDate');
        return $this;
    }

    /**
     * @return ResourceDTO|null
     * @Groups({"detailImage"})
     */
    public function getDetailImageResource() : ?ResourceDTO
    {
        return $this->detailImageResource;
    }

    /**
     * @param ResourceDTO|null $resource
     * @return ArticleDTO
     */
    public function setDetailImageResource(?ResourceDTO $resource): ArticleDTO
    {
        $this->detailImageResource = $resource;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('detailImageResource');
        return $this;
    }

    /**
     * @return ResourceGeometryDTO
     * @Groups({"geometry"})
     */
    public function getGeometry(): ?ResourceGeometryDTO
    {
        return $this->geometry;
    }

    /**
     * @param ResourceGeometryDTO $geometry
     * @return ArticleDTO
     */
    public function setGeometry(?ResourceGeometryDTO $geometry): ArticleDTO
    {
        $this->geometry = $geometry;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('geometry');
        return $this;
    }
}