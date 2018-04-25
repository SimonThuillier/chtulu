<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 22:59
 */

namespace AppBundle\DTO;

use AppBundle\Utils\UrlBag;
use Symfony\Component\Serializer\Annotation\Groups;
use AppBundle\Entity\ArticleType;
use AppBundle\Mediator\DTOMediator;
use AppBundle\Utils\HDate;
use Symfony\Component\Validator\Constraints as Assert;
use AppBundle\Validator as HbAssert;

/**
 * @HbAssert\EndHDateSuperiorToBeginHDate()
 */
class ArticleDTO extends EntityMutableDTO
{
    /** @var integer */
    protected $id;
    /** @var string */
    protected $title;
    /** @var ArticleType */
    protected $type;
    /** @var string */
    protected $abstract;
    /** @var HDate */
    protected $beginHDate;
    /** @var HDate */
    protected $endHDate;
    /** @var boolean */
    protected $hasEndDate;
    /** @var DTOMediator */
    protected $mediator;
    /** @var UrlBag */
    protected $urlBag;

    /**
     * ArticleDTO constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @return int
     * @Groups({"minimal"})
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int
     * @return self
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
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
    public function setTitle($title)
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
    public function setType($type)
    {
        $this->type = $type;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('type');
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
    public function getBeginHDate()
    {
        return $this->beginHDate;
    }

    /**
     * @param HDate $hDate
     * @return self
     */
   public function setBeginHDate($hDate)
    {
        $this->beginHDate=$hDate;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('beginHDate');
        return $this;
    }

    /**
     * @return HDate
     * @Groups({"date"})
     */
    public function getEndHDate()
    {
        return $this->endHDate;
    }

    /**
     * @param HDate $hDate
     * @return self
     */
    public function setEndHDate($hDate)
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
     * @return UrlBag
     * @Groups({"readUrl","editUrl","adminUrl","url"})
     */
    public function getUrlBag()
    {
        return $this->urlBag;
    }

    /**
     * @param UrlBag $urlBag
     * @return ArticleDTO
     */
    public function setUrlBag($urlBag): ArticleDTO
    {
        $this->urlBag = $urlBag;
        return $this;
    }



}