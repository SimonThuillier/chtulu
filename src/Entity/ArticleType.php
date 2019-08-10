<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * ArticleType
 * @author Belze
 * @ORM\Table(name="hb_article_type")
 * @ORM\Entity(repositoryClass="App\Repository\ArticleTypeRepository")
 */
class ArticleType
{
    const EVENT=1;
    const CHARACTER=2;
    const THEME=3;
    const PLACE=4;

    /**
     * @var int
     * @ORM\Column(name="id", type="bigint")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     * @ORM\Column(name="label", type="string", length=50, unique=true)
     */
    private $label;

    public function __toString()
    {
        return $this->label;
    }

    /**
     * Get id
     * @return int
     * @Groups({"minimal"})
     */
    public function getId() : ?int
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
     * @Groups({"minimal"})
     */
    public function getLabel()
    {
        return $this->label;
    }
}

