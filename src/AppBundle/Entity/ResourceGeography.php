<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * GeographyResource
 *
 * @ORM\Table(name="hb_resource_geography")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ResourceGeographyRepository")
 */
class ResourceGeography
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
     * @var geography
     *
     * @ORM\Column(name="target_geography", type="geography")
     */
    private $targetGeography;

    /**
     * @var geography
     *
     * @ORM\Column(name="zoom_geography", type="geography")
     */
    private $zoomGeography;


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
     * Set targetGeography.
     *
     * @param geography $targetGeography
     *
     * @return ResourceGeography
     */
    public function setTargetGeography($targetGeography)
    {
        $this->targetGeography = $targetGeography;

        return $this;
    }

    /**
     * Get targetGeography.
     *
     * @return geography
     */
    public function getTargetGeography()
    {
        return $this->targetGeography;
    }

    /**
     * Set zoomGeography.
     *
     * @param geography $zoomGeography
     *
     * @return ResourceGeography
     */
    public function setZoomGeography($zoomGeography)
    {
        $this->zoomGeography = $zoomGeography;

        return $this;
    }

    /**
     * Get zoomGeography.
     *
     * @return geography
     */
    public function getZoomGeography()
    {
        return $this->zoomGeography;
    }
}
