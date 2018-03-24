<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 22:59
 */

namespace AppBundle\DTO;


use AppBundle\Entity\ArticleType;
use AppBundle\Utils\HDate;

class ArticleDTO implements DTO,ArticleMinimalDTO,ArticleDateDTO
{
    /** @var string */
    protected $title;
    /** @var string */
    protected $abstract;
    /** @var ArticleType */
    protected $type;
    /** @var HDate */
    protected $beginHDate;
    /** @var HDate */
    protected $endHDate;
    /** @var boolean */
    protected $hasEndDate;
    /** @var array */
    protected $parts;

    /**
     * ArticleDTO constructor.
     */
    public function __construct()
    {
        $this->parts = ['minimal'=>false,'date'=>false];
    }

    /**
     * @return HDate
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
        return $this;
    }

    /**
     * @return HDate
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
        return $this;
    }

    /**
     * @return boolean
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
        return $this;
    }

    /**
     * @return string
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
        return $this;
    }

    /**
     * @return mixed
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
        return $this;
    }

    /**
     * @return mixed
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
        return $this;
    }

    public function getParts()
    {
        return $this->parts;
    }

    public function declareActivePart($part)
    {
        if(in_array($part,$this->parts)) $this->parts = true;
        return $this;
    }
}