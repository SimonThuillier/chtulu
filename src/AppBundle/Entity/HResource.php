<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\CustomIdGenerator;

/**
 * Resource
 *
 * @ORM\Table(name="hb_resource")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ResourceRepository")
 */
class HResource extends DTOMutableEntity
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="bigint")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @CustomIdGenerator
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=100, unique=false)
     */
    protected $name;

    /**
     * @var ResourceType
     * @ORM\ManyToOne(targetEntity="ResourceType")
     * @ORM\JoinColumn(name="type_id", referencedColumnName="id")
     */
    protected $type;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User",inversedBy="createdResources")
     * @ORM\JoinColumn(name="creation_user_id", referencedColumnName="id")
     */
    protected $creationUser;

    /**
     * @var \DateTime
     * @ORM\Column(name="creation_date", type="datetime")
     */
    protected $creationDate;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="edition_user_id", referencedColumnName="id")
     */
    protected $editionUser;

    /**
     * @var \DateTime
     * @ORM\Column(name="edition_date", type="datetime")
     */
    protected $editionDate;

    /**
     * @var ArrayCollection
     * @ORM\OneToMany(targetEntity="ResourceVersion", mappedBy="resource")
     */
    private $versions;


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
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     * @return self
     */
    public function setName(string $name): HResource
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return ResourceType
     */
    public function getType(): ResourceType
    {
        return $this->type;
    }

    /**
     * @param ResourceType $type
     * @return self
     */
    public function setType(ResourceType $type): HResource
    {
        $this->type = $type;
        return $this;
    }

    /**
     * @return User
     */
    public function getCreationUser(): User
    {
        return $this->creationUser;
    }

    /**
     * @param User $creationUser
     * @return Resource
     */
    public function setCreationUser(User $creationUser): HResource
    {
        $this->creationUser = $creationUser;
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getCreationDate(): \DateTime
    {
        return $this->creationDate;
    }

    /**
     * @param \DateTime $creationDate
     * @return Resource
     */
    public function setCreationDate(\DateTime $creationDate): HResource
    {
        $this->creationDate = $creationDate;
        return $this;
    }

    /**
     * @return User
     */
    public function getEditionUser(): User
    {
        return $this->editionUser;
    }

    /**
     * @param User $editionUser
     * @return self
     */
    public function setEditionUser(User $editionUser): HResource
    {
        $this->editionUser = $editionUser;
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getEditionDate(): \DateTime
    {
        return $this->editionDate;
    }

    /**
     * @param \DateTime $editionDate
     * @return self
     */
    public function setEditionDate(\DateTime $editionDate): HResource
    {
        $this->editionDate = $editionDate;
        return $this;
    }

    /**
     * @return ArrayCollection
     */
    public function getVersions(): ArrayCollection
    {
        return ($this->versions)?$this->versions:new ArrayCollection();
    }

}
