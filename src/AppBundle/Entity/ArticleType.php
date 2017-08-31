<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * ArticleType
 * @author Belze
 * @ORM\Table(name="article_type")
 * @ORM\Entity()
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
     */
    private $id;

    /**
     * @var string
     * @ORM\Column(name="label", type="string", length=50, unique=true)
     */
    private $label;
    
    /**
     * @var ArrayCollection
     * @ORM\OneToMany(targetEntity="ArticleSubType", mappedBy="type")
     */
    private $subTypes;

    public function __toString()
    {
        return $this->label;
    }

    /**
     * Get id
     * @return int
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
     */
    public function getLabel()
    {
        return $this->label;
    }
    
    /**
     * Get subTypes
     * @return ArrayCollection
     */
    public function getSubTypes(){
        return $this->subTypes;
    }
}

