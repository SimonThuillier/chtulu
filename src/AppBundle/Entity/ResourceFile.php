<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ResourceFile
 *
 * @ORM\Table(name="hb_resource_file")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ResourceFileRepository")
 */
class ResourceFile
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
     * @ORM\Column(name="uri", type="string", length=255)
     */
    private $uri;

    /**
     * @var string
     *
     * @ORM\Column(name="type", type="string", length=10)
     */
    private $type;

    /**
     * @var string|null
     *
     * @ORM\Column(name="mimeType", type="string", length=10, nullable=true)
     */
    private $mimeType;

    /**
     * @var int
     *
     * @ORM\Column(name="size", type="integer")
     */
    private $size;


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
     * Set uri.
     *
     * @param string $uri
     *
     * @return ResourceFile
     */
    public function setUri($uri)
    {
        $this->uri = $uri;

        return $this;
    }

    /**
     * Get uri.
     *
     * @return string
     */
    public function getUri()
    {
        return $this->uri;
    }

    /**
     * Set type.
     *
     * @param string $type
     *
     * @return ResourceFile
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type.
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set mimeType.
     *
     * @param string|null $mimeType
     *
     * @return ResourceFile
     */
    public function setMimeType($mimeType = null)
    {
        $this->mimeType = $mimeType;

        return $this;
    }

    /**
     * Get mimeType.
     *
     * @return string|null
     */
    public function getMimeType()
    {
        return $this->mimeType;
    }

    /**
     * Set size.
     *
     * @param int $size
     *
     * @return ResourceFile
     */
    public function setSize($size)
    {
        $this->size = $size;

        return $this;
    }

    /**
     * Get size.
     *
     * @return int
     */
    public function getSize()
    {
        return $this->size;
    }
}
