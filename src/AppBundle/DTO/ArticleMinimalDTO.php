<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 22:46
 */

namespace AppBundle\DTO;


use AppBundle\Entity\ArticleType;

interface ArticleMinimalDTO
{
    /** @return string */
    public function getTitle();

    /** @param string $title
     * @return $this
     * */
    public function setTitle($title);

    /** @return string */
    public function getAbstract();

    /** @param string $abstract
     * @return $this
     * */
    public function setAbstract($abstract);

    /** @return string */
    public function getType();

    /** @param ArticleType $type
     * @return self
     * */
    public function setType($type);
}