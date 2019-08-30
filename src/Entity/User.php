<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * User
 * @author Belze
 * @ORM\Table(name="hb_user")
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @UniqueEntity(fields="username", message="Username {{ value }} is already used. Please choose another.")
 * @UniqueEntity(fields="email", message="Email {{ value }} is already used. Please choose another.")
 */
class User implements UserInterface,\Serializable
{
    /**
     * @var int
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(name="id", type="bigint")
     */
    private $id;

    /**
     * @var string
     * @ORM\Column(name="username", type="string", length=50, unique=true)
     * @Assert\NotNull(message="username is null.")
     * @Assert\NotBlank(message="username {{ value }} is empty.")
     */
    private $username;

    /**
     * @var string
     * @ORM\Column(name="firstname", type="string", length=50, nullable=true)
     */
    private $firstname;

    /**
     * @var string
     * @ORM\Column(name="lastname", type="string", length=50, nullable=true)
     */
    private $lastname;

    /**
     * @var string
     * @ORM\Column(name="email", type="string", length=100, unique=true)
     * @Assert\NotNull(message="email is null.")
     * @Assert\NotBlank(message="email {{ value }} is empty.")
     * @Assert\Email(message="email {{ value }} is not a valid email address.",checkMX=true)
     */
    private $email;

    /**
     * @var string
     * @ORM\Column(name="salt", type="string", length=255)
     */
    private $salt;

    /**
     * @var string
     * @ORM\Column(name="password", type="string", length=255)
     */
    private $password;

    /**
     * @var string
     * @Assert\NotBlank(message="password {{ value }} is empty.")
     */
    private $plainPassword;

    /**
     * @var \DateTime
     * @ORM\Column(name="creation", type="datetime")
     */
    private $creation;

    /**
     * @var \DateTime
     * @ORM\Column(name="last_update", type="datetime")
     */
    private $lastUpdate;

    /**
     * @var \DateTime
     * @ORM\Column(name="last_login", type="datetime")
     */
    private $lastLogin;

    /**
     * @var \DateTime
     * @ORM\Column(name="birth", type="date", nullable=true)
     */
    private $birth;

    /**
     * @var string
     * @ORM\Column(name="description", type="string", length=1024, nullable=true)
     */
    private $description;

    /**
     * @var boolean
     * @ORM\Column(name="enabled", type="boolean")
     */
    private $enabled;

    /**
     * @var ArrayCollection
     * @ORM\OneToMany(targetEntity="Article", mappedBy="creationUser")
     */
    private $createdArticles;

    /**
     * @var ArrayCollection
     * @ORM\OneToMany(targetEntity="HResource", mappedBy="creationUser")
     */
    private $createdResources;

    /**
     * @var ArrayCollection
     * @ORM\OneToMany(targetEntity="ResourceVersion", mappedBy="creationUser")
     */
    private $createdResourceVersions;


    public function __construct(){
        $this->plainPassword = "aValidDummyPassword";
    }

    /**
     * Get id
     * @return int
     */
    public function getId() :?int
    {
        return $this->id;
    }

    /**
     * Set username
     * @param string $username
     * @return User
     */
    public function setUsername($username)
    {
        $this->username = $username;
        return $this;
    }

    /**
     * Get username
     * @return string
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * Set firstname
     * @param string $firstname
     * @return User
     */
    public function setFirstname($firstname)
    {
        $this->firstname = $firstname;

        return $this;
    }

    /**
     * Get firstname
     * @return string
     */
    public function getFirstname()
    {
        return $this->firstname;
    }

    /**
     * Set lastname
     * @param string $lastname
     * @return User
     */
    public function setLastname($lastname)
    {
        $this->lastname = $lastname;

        return $this;
    }

    /**
     * Get lastname
     * @return string
     */
    public function getLastname()
    {
        return $this->lastname;
    }

    /**
     * Set email
     * @param string $email
     * @return User
     */
    public function setEmail($email)
    {
        $this->email = $email;
        return $this;
    }

    /**
     * Get email
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Get plainPassword
     * @return string
     */
    public function getPlainPassword(){
        return $this->plainPassword;
    }

    /**
     * Set plainPassword
     * @param string $plainPassword
     * @return User
     */
    public function setPlainPassword($plainPassword)
    {
        $this->plainPassword = $plainPassword;
        return $this;
    }

    /**
     * Set password
     * @param string
     * @return User
     */
    public function setPassword($password)
    {
        $this->password = $password;
        return $this;
    }

    /**
     * Get password
     * @return string
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * Set creation
     * @param \DateTime $creation
     * @return User
     */
    public function setCreation($creation)
    {
        $this->creation = $creation;

        return $this;
    }

    /**
     * Get creation
     * @return \DateTime
     */
    public function getCreation()
    {
        return $this->creation;
    }

    /**
     * Get lastUpdate
     * @return \DateTime
     */
    public function getLastUpdate(){
        return $this->lastUpdate;
    }

    /**
     * Set lastUpdate
     * @param \DateTime $lastUpdate
     * @return User
     */
    public function setLastUpdate($lastUpdate){
        $this->lastUpdate = $lastUpdate;
        return $this;
    }

    /**
     * Set lastLogin
     * @param \DateTime $lastLogin
     * @return User
     */
    public function setLastLogin($lastLogin)
    {
        $this->lastLogin = $lastLogin;

        return $this;
    }

    /**
     * Get lastLogin
     * @return \DateTime
     */
    public function getLastLogin()
    {
        return $this->lastLogin;
    }

    /**
     * Set birth
     * @param \DateTime $birth
     * @return User
     */
    public function setBirth($birth)
    {
        $this->birth = $birth;

        return $this;
    }

    /**
     * Get birth
     * @return \DateTime
     */
    public function getBirth()
    {
        return $this->birth;
    }

    /**
     * Set description
     * @param string $description
     * @return User
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Get enabled
     * @return boolean
     */
    public function getEnabled(){
        return $this->enabled;
    }

    /**
     * Set enabled
     * @param boolean $enabled
     * @return User
     */
    public function setEnabled($enabled){
        $this->enabled = $enabled;
        return $this;
    }

    public function eraseCredentials()
    {}

    /**
     * Get salt
     * @return string
     * {@inheritDoc}
     * @see \Symfony\Component\Security\Core\User\UserInterface::getSalt()
     */
    public function getSalt()
    {
        return $this->salt;
    }

    /**
     * Set salt
     * @param string
     * @return User
     */
    public function setSalt($salt)
    {
        $this->salt = $salt;
        return $this;
    }

    /**
     * Get roles
     * @return array
     */
    public function getRoles()
    {
        return array("ROLE_USER");
    }

    /**
     * @return string
     */
    public function serialize()
    {
        return serialize(array(
            $this->id,
            $this->username,
            $this->password,
            $this->salt
        ));
    }

    /**
     * @param \Serializable $serialized
     * @return User;
     */
    public function unserialize($serialized)
    {
        list (
            $this->id,
            $this->username,
            $this->password,
            $this->salt
            ) = unserialize($serialized);
        return $this;
    }

    /**
     * @return boolean
     */
    public function isAccountNonExpired()
    {
        return true;
    }

    /**
     * @return boolean
     */
    public function isCredentialsNonExpired()
    {
        return true;
    }

    /**
     * @return boolean
     */
    public function isEnabled()
    {
        return $this->enabled;
    }

    /**
     * @return boolean
     */
    public function isAccountNonLocked()
    {
        return true;
    }

    /**
     * Get createdArticles
     * @return ArrayCollection
     */
    public function getCreatedArticles(){
        return $this->createdArticles;
    }

    /**
     * @return ArrayCollection
     */
    public function getCreatedResources(): ArrayCollection
    {
        return $this->createdResources;
    }

    /**
     * @return ArrayCollection
     */
    public function getCreatedResourceVersions(): ArrayCollection
    {
        return $this->createdResourceVersions;
    }


}

