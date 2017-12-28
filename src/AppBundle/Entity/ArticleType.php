<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use AppBundle\Repository;

/**
 * ArticleType
 * @author Belze
 * @ORM\Table(name="hb_article_type")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ArticleTypeRepository")
 */
class ArticleType
{
    const EVENT=1;
    const CHARACTER=2;
    const THEME=3;

    /**
     * @var int
     * @ORM\Column(name="id", type="bigint")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Groups("group1")
     */
    private $id;

    /**
     * @var string
     * @ORM\Column(name="label", type="string", length=50, unique=true)
     * @Groups("group1")
     */
    private $label;

    public function __toString()
    {
        return $this->label;
    }

    /**
     * Get id
     * @return int
     * @Groups("group1")
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set label
     * @param string $label
     * @return ArticleType
     */
    public function setLabel($label)
    {
        $this->label = $label;
        return $this;
    }

    /**
     * Get label
     * @return string
     * @Groups("group1")
     */
    public function getLabel()
    {
        return $this->label;
    }
}

