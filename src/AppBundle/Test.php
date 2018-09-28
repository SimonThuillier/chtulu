<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 21/03/18
 * Time: 21:28
 */

namespace AppBundle;


use AppBundle\Utils\HDate;

class Test
{
    /** @var String */
    private $title;

    /** @var HDate  */
    private $hDate;

    /**
     * @return String
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param String $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * @return HDate
     */
    public function getHDate()
    {
        return $this->hDate;
    }

    /**
     * @param HDate $hDate
     */
    public function setHDate($hDate)
    {
        $this->hDate = $hDate;
    }
}