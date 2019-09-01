<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 31/08/19
 * Time: 13:36
 */

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * PendingAction : store in DB the user pending action (registration, passwordRecovery...)
 * @author Belze
 * @ORM\Table(name="hb_pending_action")
 * @ORM\Entity(repositoryClass="App\Repository\PendingActionRepository")
 */
class PendingAction
{
    const REGISTRATION='REGISTRATION';

    const STATUS_VALID='VALID';
    const STATUS_INCOMPLETE='INCOMPLETE';
    const STATUS_DONE='DONE';
    const STATUS_EXPIRED='EXPIRED';
    
    /**
     * @var int
     * @ORM\Column(name="id", type="bigint")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     * @ORM\Column(name="type", type="string", length=50,nullable=false)
     */
    private $type;

    /**
     * @var string
     * @ORM\Column(name="email", type="string", length=255,nullable=true)
     */
    private $email;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id",nullable=true)
     */
    private $user;

    /**
     * @var string
     * @ORM\Column(name="data", type="string", length=2048,nullable=true)
     */
    private $data;

    /**
     * @var string
     * @ORM\Column(name="token", type="string", length=255,nullable=false)
     */
    private $token;

    /**
     * @var \DateTime
     * @ORM\Column(name="created_at", type="datetime",nullable=false)
     */
    private $createdAt;

    /**
     * @var \DateTime
     * @ORM\Column(name="updated_at", type="datetime",nullable=false)
     */
    private $updatedAt;

    /**
     * @var \DateTime
     * @ORM\Column(name="done_at", type="datetime",nullable=true)
     */
    private $doneAt;

    /**
     * @var integer
     * if -1 no expirationDelay
     * number of minutes between update date and the moment the action is no longer valid
     * @ORM\Column(name="expiration_delay", type="integer", nullable=false)
     */
    private $expirationDelay;


    /**
     * @return int
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getType(): ?string
    {
        return $this->type;
    }

    /**
     * @param string $type
     * @return PendingAction
     */
    public function setType(string $type): ?PendingAction
    {
        $this->type = $type;
        return $this;
    }

    /**
     * @return string
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string $email
     * @return PendingAction
     */
    public function setEmail(?string $email): PendingAction
    {
        $this->email = $email;
        return $this;
    }

    /**
     * @return User
     */
    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * @param User $user
     * @return PendingAction
     */
    public function setUser(?User $user): PendingAction
    {
        $this->user = $user;
        return $this;
    }

    /**
     * @return string
     */
    public function getData(): ?string
    {
        return $this->data;
    }

    /**
     * @param string $data
     * @return PendingAction
     */
    public function setData(?string $data): PendingAction
    {
        $this->data = $data;
        return $this;
    }

    /**
     * @return string
     */
    public function getToken(): ?string
    {
        return $this->token;
    }

    /**
     * @param string $token
     * @return PendingAction
     */
    public function setToken(string $token): PendingAction
    {
        $this->token = $token;
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getCreatedAt(): ?\DateTime
    {
        return $this->createdAt;
    }

    /**
     * @param \DateTime $createdAt
     * @return PendingAction
     */
    public function setCreatedAt(\DateTime $createdAt): PendingAction
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getUpdatedAt(): ?\DateTime
    {
        return $this->updatedAt;
    }

    /**
     * @param \DateTime $updatedAt
     * @return PendingAction
     */
    public function setUpdatedAt(\DateTime $updatedAt): PendingAction
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getDoneAt(): ?\DateTime
    {
        return $this->doneAt;
    }

    /**
     * @param \DateTime $doneAt
     * @return PendingAction
     */
    public function setDoneAt(?\DateTime $doneAt): PendingAction
    {
        $this->doneAt = $doneAt;
        return $this;
    }

    /**
     * @return int
     */
    public function getExpirationDelay(): ?int
    {
        return $this->expirationDelay;
    }

    /**
     * @param int $expirationDelay
     * @return PendingAction
     */
    public function setExpirationDelay(int $expirationDelay): PendingAction
    {
        $this->expirationDelay = $expirationDelay;
        return $this;
    }

    /**
     * if incomplete or cannot expirate return null
     * @return \DateTime
     */
    public function getExpireAt(): ?\DateTime
    {
        if($this->updatedAt === null || $this->expirationDelay === null || $this->expirationDelay === -1) return null;
        $expireAt = (clone $this->updatedAt)->add(new \DateInterval('P' . $this->expirationDelay . 'M'));
        return $expireAt;
    }

    /**
     * is the pending action doable at this time ? (return valid, otherwise one of the error code)
     * @return string
     */
    public function getExecutionStatus()
    {
        if($this->updatedAt === null || $this->expirationDelay === null) return self::STATUS_INCOMPLETE;
        elseif($this->doneAt !== null) return self::STATUS_DONE;
        elseif($this->expirationDelay !== -1 &&
            ((new \DateTime())->getTimestamp() > $this->getExpireAt()->getTimestamp())) return self::STATUS_EXPIRED;

        return self::STATUS_VALID;
    }
}