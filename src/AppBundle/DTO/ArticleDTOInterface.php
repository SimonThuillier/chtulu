<?php

namespace AppBundle\DTO;

use AppBundle\Entity\ArticleType;
use AppBundle\Entity\ArticleSubType;

interface ArticleDTOInterface
{
    /** @return string */
    public function getTitle();
    /**
     * @param string $title
     * @return self
     */
    public function setTitle($title);
    /** @return ArticleType */
    public function getType();
    /**
     * @param ArticleType
     * @return self
     */
    public function setType($type);
    /**
     * @return ArticleSubType
     */
    public function getSubType();
    /**
     * @param ArticleSubType $subType
     * @return self
     */
    public function setSubType($subType);
    /**
     * @return string
     */
    public function getAbstract();
    /**
     * @param string $abstract
     * @return self
     */
    public function setAbstract($abstract);
}
