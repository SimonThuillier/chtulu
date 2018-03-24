<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:51
 */

namespace AppBundle\DTO;


interface DTO
{
/** @return array */
public function getParts();
/** @param string $part
 * @return self
 */
function declareActivePart($part);
}