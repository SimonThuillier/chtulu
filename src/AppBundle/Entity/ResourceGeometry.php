<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * GeometryResource
 *
 * @ORM\Table(name="hb_resource_geometry")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ResourceGeometryRepository")
 */
class ResourceGeometry extends DTOMutableEntity
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
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set targetGeometry.
     *
     * @param geometry $targetGeometry
     *
     * @return ResourceGeometry
     */
    public function setTargetGeometry($targetGeometry)
    {
        $this->targetGeometry = $targetGeometry;

        return $this;
    }

    /**
     * Get targetGeometry.
     *
     * @return geometry
     */
    public function getTargetGeometry()
    {
        return $this->targetGeometry;
    }

    /**
     * Set zoomGeometry.
     *
     * @param geometry $zoomGeometry
     *
     * @return ResourceGeometry
     */
    public function setZoomGeometry($zoomGeometry)
    {
        $this->zoomGeometry = $zoomGeometry;

        return $this;
    }

    /**
     * Get zoomGeometry.
     *
     * @return geometry
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
     * @return ResourceGeometry
     */
    public function setComment(?string $comment): ResourceGeometry
    {
        $this->comment = $comment;
        return $this;
    }
}
