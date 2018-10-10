<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * ResourceType
 *
 * @ORM\Table(name="hb_resource_type")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ResourceTypeRepository")
 */
class ResourceType
{
    const IMAGE = 1;
    const TEXT = 2;

    /**
     * @var int
     *
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
     * Get id .
     * @return int
     * @Groups({"minimal"})
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set label.
     * @param string $label
     * @return ResourceType
     */
    public function setLabel($label)
    {
        $this->label = $label;
        return $this;
    }

    /**
     * Get label.
     * @return string
     * @Groups({"minimal"})
     */
    public function getLabel()
    {
        return $this->label;
    }
}
