<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ResourceVersion
 *
 * @ORM\Table(name="hb_resource_version")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ResourceVersionRepository")
 */
class ResourceVersion extends DTOMutableEntity
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
     * @var Resource
     * @ORM\ManyToOne(targetEntity="HResource",inversedBy="versions")
     * @ORM\JoinColumn(name="resource_id", referencedColumnName="id")
     */
    protected $resource;

    /**
     * @var int
     *
     * @ORM\Column(name="number", type="integer")
     */
    private $number;

    /**
     * @var bool
     *
     * @ORM\Column(name="active", type="boolean")
     */
    private $active;

    /**
     * @var string
     *
     * @ORM\Column(name="comment", type="string", length=255, nullable=true)
     */
    protected $comment;

    /**
     * @var ResourceFile|null
     * @ORM\OneToOne(targetEntity="ResourceFile")
     * @ORM\JoinColumn(name="resource_file_id", referencedColumnName="id",nullable=true)
     */
    protected $file;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User",inversedBy="createdResourceVersions")
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
     * @var User
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="creation_user_id", referencedColumnName="id",nullable=true)
     */
    protected $archivingUser;

    /**
     * @var \DateTime
     * @ORM\Column(name="archiving_date", type="datetime",nullable=true)
     */
    protected $archivingDate;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="deletion_user_id", referencedColumnName="id",nullable=true)
     */
    protected $deletionUser;

    /**
     * @var \DateTime
     * @ORM\Column(name="deletion_date", type="datetime",nullable=true)
     */
    protected $deletionDate;


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
     * @return Resource
     */
    public function getResource(): HResource
    {
        return $this->resource;
    }

    /**
     * @param Resource $resource
     * @return ResourceVersion
     */
    public function setResource(HResource $resource): ResourceVersion
    {
        $this->resource = $resource;
        return $this;
    }

    /**
     * Set number.
     *
     * @param int $number
     *
     * @return ResourceVersion
     */
    public function setNumber($number)
    {
        $this->number = $number;

        return $this;
    }

    /**
     * Get number.
     *
     * @return int
     */
    public function getNumber()
    {
        return $this->number;
    }

    /**
     * Set active.
     *
     * @param bool $active
     *
     * @return ResourceVersion
     */
    public function setActive($active)
    {
        $this->active = $active;

        return $this;
    }

    /**
     * Get active.
     *
     * @return bool
     */
    public function getActive()
    {
        return $this->active;
    }

    /**
     * @return string|null
     */
    public function getComment(): ?string
    {
        return $this->comment;
    }

    /**
     * @param string|null $comment
     * @return ResourceVersion
     */
    public function setComment(?string $comment): ResourceVersion
    {
        $this->comment = $comment;
        return $this;
    }

    /**
     * @return ResourceFile|null
     */
    public function getFile(): ?ResourceFile
    {
        return $this->file;
    }

    /**
     * @param ResourceFile|null $file
     * @return ResourceVersion
     */
    public function setFile(?ResourceFile $file): ResourceVersion
    {
        $this->file = $file;
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
     * @return ResourceVersion
     */
    public function setCreationUser(User $creationUser): ResourceVersion
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
     * @return ResourceVersion
     */
    public function setCreationDate(\DateTime $creationDate): ResourceVersion
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
     * @return ResourceVersion
     */
    public function setEditionUser(User $editionUser): ResourceVersion
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
     * @return ResourceVersion
     */
    public function setEditionDate(\DateTime $editionDate): ResourceVersion
    {
        $this->editionDate = $editionDate;
        return $this;
    }

    /**
     * @return User|null
     */
    public function getArchivingUser(): ?User
    {
        return $this->archivingUser;
    }

    /**
     * @param User $archivingUser
     * @return ResourceVersion
     */
    public function setArchivingUser(User $archivingUser): ResourceVersion
    {
        $this->archivingUser = $archivingUser;
        return $this;
    }

    /**
     * @return \DateTime|null
     */
    public function getArchivingDate(): ?\DateTime
    {
        return $this->archivingDate;
    }

    /**
     * @param \DateTime $archivingDate
     * @return ResourceVersion
     */
    public function setArchivingDate(\DateTime $archivingDate): ResourceVersion
    {
        $this->archivingDate = $archivingDate;
        return $this;
    }

    /**
     * @return User|null
     */
    public function getDeletionUser(): ?User
    {
        return $this->deletionUser;
    }

    /**
     * @param User $deletionUser
     * @return ResourceVersion
     */
    public function setDeletionUser(User $deletionUser): ResourceVersion
    {
        $this->deletionUser = $deletionUser;
        return $this;
    }

    /**
     * @return \DateTime|null
     */
    public function getDeletionDate(): ?\DateTime
    {
        return $this->deletionDate;
    }

    /**
     * @param \DateTime $deletionDate
     * @return ResourceVersion
     */
    public function setDeletionDate(\DateTime $deletionDate): ResourceVersion
    {
        $this->deletionDate = $deletionDate;
        return $this;
    }

}
