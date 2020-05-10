<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * GeometryResource
 *
 * @ORM\Table(name="ct_pop")
 * @ORM\Entity(repositoryClass="App\Repository\PopRepository")
 */
class Pop extends DTOMutableEntity
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="bigint")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var geometry
     *
     * @ORM\Column(name="target_geometry", type="geometry")
     */
    private $targetGeometry;

    /**
     * @var PopType
     * @ORM\ManyToOne(targetEntity="PopType")
     * @ORM\JoinColumn(name="type_id", referencedColumnName="id",nullable=false)
     */
    protected $type;

    /**
     * @var geometry
     *
     * @ORM\Column(name="zoom_geometry", type="geometry",nullable=true)
     */
    private $zoomGeometry;

    /**
     * @var string
     *
     * @ORM\Column(name="comment", type="string",length=255,nullable=true)
     */
    private $comment;

    /**
     * @var integer
     *
     * @ORM\Column(name="number", type="integer")
     */
    private $number;


    /**
     * Get id.
     *
     * @return int
     */
    public function getId() :?int
    {
        return $this->id;
    }

    /**
     * @return PopType
     */
    public function getType(): PopType
    {
        return $this->type;
    }

    /**
     * @param PopType $type
     * @return Pop
     */
    public function setType(PopType $type): Pop
    {
        $this->type = $type;
        return $this;
    }

    /**
     * Set targetGeometry.
     *
     * @param string $targetGeometry
     *
     * @return Pop
     */
    public function setTargetGeometry($targetGeometry)
    {
        $this->targetGeometry = $targetGeometry;

        return $this;
    }

    /**
     * Get targetGeometry.
     *
     * @return string
     */
    public function getTargetGeometry()
    {
        return $this->targetGeometry;
    }

    /**
     * Set zoomGeometry.
     *
     * @param string $zoomGeometry
     *
     * @return Pop
     */
    public function setZoomGeometry($zoomGeometry)
    {
        $this->zoomGeometry = $zoomGeometry;

        return $this;
    }

    /**
     * Get zoomGeometry.
     *
     * @return string
     */
    public function getZoomGeometry()
    {
        return $this->zoomGeometry;
    }

    /**
     * @return string
     */
    public function getComment(): ?string
    {
        return $this->comment;
    }

    /**
     * @param string $comment
     * @return Pop
     */
    public function setComment(?string $comment): Pop
    {
        $this->comment = $comment;
        return $this;
    }

    /**
     * @return int
     */
    public function getNumber(): int
    {
        return $this->number;
    }

    /**
     * @param int $number
     * @return Pop
     */
    public function setNumber(int $number): Pop
    {
        $this->number = $number;
        return $this;
    }

}
