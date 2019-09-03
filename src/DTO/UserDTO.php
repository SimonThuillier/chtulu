<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 22:59
 */

namespace App\DTO;

use App\Mediator\DTOMediator;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Validator as HbAssert;

/**
 * @HbAssert\UniqueUsername(groups={"minimal"})
 */
class UserDTO extends EntityMutableDTO
{
    /** @var string */
    protected $username;
    /** @var \DateTime */
    protected $creation;
    /** @var string */
    protected $email;
    /** @var string */
    protected $signature;
    /** @var string */
    protected $description;
    /** @var mixed */
    protected $detailImageResource;
    /** @var DTOMediator */
    protected $mediator;

    /**
     * ArticleDTO constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @return string
     * @groups({"minimal"})
     * @Assert\NotBlank(groups={"minimal"})
     * @Assert\NotNull(groups={"minimal"})
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * @param string $username
     * @return self
     */
    public function setUsername($username): UserDTO
    {
        $this->username = $username;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('username');
        return $this;
    }

    /**
     * @return \DateTime
     * @groups({"minimal"})
     * @Assert\NotNull()
     */
    public function getCreation(): ?\DateTime
    {
        return $this->creation;
    }

    /**
     * @param \DateTime $creation
     * @return UserDTO
     */
    public function setCreation(?\DateTime $creation): UserDTO
    {
        $this->creation = $creation;
        return $this;
    }

    /**
     * @return string|null
     * @groups({"minimal"})
     */
    public function getSignature(): ?string
    {
        return $this->signature;
    }

    /**
     * @param string|null $signature
     * @return UserDTO
     */
    public function setSignature(?string $signature): UserDTO
    {
        $this->signature = $signature;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('signature');
        return $this;
    }

    /**
     * @return string
     * @groups({"email"})
     * @Assert\NotBlank()
     * @Assert\NotNull()
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string $email
     * @return UserDTO
     */
    public function setEmail(?string $email): UserDTO
    {
        $this->email = $email;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('email');
        return $this;
    }

    /**
     * @return string
     * @groups({"description"})
     */
    public function getDescription(): ?string
    {
        return $this->description;
    }

    /**
     * @param string|null $description
     * @return UserDTO
     */
    public function setDescription(?string $description): UserDTO
    {
        $this->description = $description;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('description');
        return $this;
    }

    /**
     * @return ResourceDTO|null
     * @Groups({"detailImage"})
     */
    public function getDetailImageResource() : ?ResourceDTO
    {
        return $this->detailImageResource;
    }

    /**
     * @param ResourceDTO|null $resource
     * @return UserDTO
     */
    public function setDetailImageResource(?ResourceDTO $resource): UserDTO
    {
        $this->detailImageResource = $resource;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('detailImageResource');
        return $this;
    }
}