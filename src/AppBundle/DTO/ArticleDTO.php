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

class ArticleDTO implements MinimalArticleDTO,DateArticleDTO
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


    /**
     * ArticleDTO constructor.
     */
    public function __construct()
    {
    }

    /**
     * @return mixed
     */
    public function getBeginHDate()
    {
        // TODO: Implement getBeginHDate() method.
    }

    /**
     * @param HDate $hDate
     * @return mixed
     */
    public function setBeginHDate($hDate)
    {
        // TODO: Implement setBeginHDate() method.
    }

    /**
     * @return mixed
     */
    public function getEndHDate()
    {
        // TODO: Implement getEndHDate() method.
    }

    /**
     * @param HDate $hDate
     * @return mixed
     */
    public function setEndHDate($hDate)
    {
        // TODO: Implement setEndHDate() method.
    }

    /**
     * @return mixed
     */
    public function getHasEndDate()
    {
        // TODO: Implement getHasEndDate() method.
    }

    /**
     * @param bool $hasEndDate
     * @return mixed
     */
    public function setHasEndDate($hasEndDate)
    {
        // TODO: Implement setHasEndDate() method.
    }

    /**
     * @return mixed
     */
    public function getTitle()
    {
        // TODO: Implement getTitle() method.
    }

    /**
     * @param string $title
     * @return mixed
     */
    public function setTitle($title)
    {
        // TODO: Implement setTitle() method.
    }

    /**
     * @return mixed
     */
    public function getAbstract()
    {
        // TODO: Implement getAbstract() method.
    }

    /**
     * @param string $abstract
     * @return mixed
     */
    public function setAbstract($abstract)
    {
        // TODO: Implement setAbstract() method.
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        // TODO: Implement getType() method.
    }

    /**
     * @param ArticleType $type
     * @return mixed
     */
    public function setType($type)
    {
        // TODO: Implement setType() method.
    }


}