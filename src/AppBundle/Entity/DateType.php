<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * DateType
 *
 * @ORM\Table(name="hb_date_type")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\DateTypeRepository")
 */
class DateType
{
    Const PRECISE=1;
    Const BOUNDED=2;
    Const MONTH=3;
    Const SEASON=4;
    Const YEAR=5;
    Const DECADE=6;
    Const CENTURY=7;
    Const MILLENIA=8;
    
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="bigint")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="label", type="string", length=50, unique=true)
     */
    private $label;

    /**
     * @var string
     *
     * @ORM\Column(name="comment", type="string", length=255, nullable=true)
     */
    private $comment;
    
    /**
     * @return string
     */
    public function __toString()
    {
        return $this->label;
    }

    /**
     * Set id (temporary)
     * @param int $id
     * @return DateType
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * Get id
     * @Groups({"minimal"})
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set label
     *
     * @param string $label
     *
     * @return DateType
     */
    public function setLabel($label)
    {
        $this->label = $label;

        return $this;
    }

    /**
     * Get label
     * @Groups({"minimal"})
     * @return string
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * Set comment
     *
     * @param string $comment
     *
     * @return DateType
     */
    public function setComment($comment)
    {
        $this->comment = $comment;

        return $this;
    }

    /**
     * Get comment
     * @Groups({"comment"})
     * @return string
     */
    public function getComment()
    {
        return $this->comment;
    }
}

