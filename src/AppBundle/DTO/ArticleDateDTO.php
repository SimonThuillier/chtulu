<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 22:51
 */

namespace AppBundle\DTO;


use AppBundle\Utils\HDate;

interface ArticleDateDTO
{
    /** @return HDate */
    public function getBeginHDate();

    /** @param HDate $hDate @return self */
    public function setBeginHDate($hDate);

    /** @return HDate */
    public function getEndHDate();

    /** @param HDate $hDate @return self */
    public function setEndHDate($hDate);

    /** @return boolean */
    public function getHasEndDate();

    /** @param boolean $hasEndDate @return self*/
    public function setHasEndDate($hasEndDate);
}