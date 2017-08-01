<?php

namespace EntityBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Life
 *
 * @ORM\Table(name="life")
 * @ORM\Entity(repositoryClass="EntityBundle\Repository\LifeRepository")
 */
class Life
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="firstname", type="string", length=64)
     */
    private $firstname;

    /**
     * @var string
     *
     * @ORM\Column(name="lastname", type="string", length=128)
     */
    private $lastname;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="birth_date_min", type="date")
     */
    private $birthDateMin;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="birth_date_max", type="date", nullable=true)
     */
    private $birthDateMax;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="death_date_min", type="date", nullable=true)
     */
    private $deathDateMin;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="death_date_max", type="date", nullable=true)
     */
    private $deathDateMax;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set firstname
     *
     * @param string $firstname
     *
     * @return Life
     */
    public function setFirstname($firstname)
    {
        $this->firstname = $firstname;

        return $this;
    }

    /**
     * Get firstname
     *
     * @return string
     */
    public function getFirstname()
    {
        return $this->firstname;
    }

    /**
     * Set lastname
     *
     * @param string $lastname
     *
     * @return Life
     */
    public function setLastname($lastname)
    {
        $this->lastname = $lastname;

        return $this;
    }

    /**
     * Get lastname
     *
     * @return string
     */
    public function getLastname()
    {
        return $this->lastname;
    }

    /**
     * Set birthDateMin
     *
     * @param \DateTime $birthDateMin
     *
     * @return Life
     */
    public function setBirthDateMin($birthDateMin)
    {
        $this->birthDateMin = $birthDateMin;

        return $this;
    }

    /**
     * Get birthDateMin
     *
     * @return \DateTime
     */
    public function getBirthDateMin()
    {
        return $this->birthDateMin;
    }

    /**
     * Set birthDateMax
     *
     * @param \DateTime $birthDateMax
     *
     * @return Life
     */
    public function setBirthDateMax($birthDateMax)
    {
        $this->birthDateMax = $birthDateMax;

        return $this;
    }

    /**
     * Get birthDateMax
     *
     * @return \DateTime
     */
    public function getBirthDateMax()
    {
        return $this->birthDateMax;
    }

    /**
     * Set deathDateMin
     *
     * @param \DateTime $deathDateMin
     *
     * @return Life
     */
    public function setDeathDateMin($deathDateMin)
    {
        $this->deathDateMin = $deathDateMin;

        return $this;
    }

    /**
     * Get deathDateMin
     *
     * @return \DateTime
     */
    public function getDeathDateMin()
    {
        return $this->deathDateMin;
    }

    /**
     * Set deathDateMax
     *
     * @param \DateTime $deathDateMax
     *
     * @return Life
     */
    public function setDeathDateMax($deathDateMax)
    {
        $this->deathDateMax = $deathDateMax;

        return $this;
    }

    /**
     * Get deathDateMax
     *
     * @return \DateTime
     */
    public function getDeathDateMax()
    {
        return $this->deathDateMax;
    }
}

