<?php

/**
 *
 */

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Article
 * @author Belze
 * @ORM\Table(name="hb_article")
 * @ORM\Entity(repositoryClass="App\Repository\ArticleRepository")
 */
class Article extends DTOMutableEntity
{
    /**
     * @var int
     * @ORM\Column(name="id", type="bigint")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     * @ORM\Column(name="title", type="string", length=64,nullable=false)
     */
    protected $title;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="creation_user_id", referencedColumnName="id",nullable=false)
     */
    protected $creationUser;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="owner_user_id", referencedColumnName="id",nullable=false)
     */
    protected $ownerUser;

    /**
     * @var \DateTime
     * @ORM\Column(name="creation_date", type="datetime",nullable=false)
     */
    protected $creationDate;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="edition_user_id", referencedColumnName="id",nullable=false)
     */
    protected $editionUser;

    /**
     * @var \DateTime
     * @ORM\Column(name="edition_date", type="datetime",nullable=false)
     */
    protected $editionDate;

    /**
     * @var boolean
     * @ORM\Column(name="active", type="boolean",nullable=false)
     */
    protected $active;

    /**
     * @var string
     * @ORM\Column(name="abstract", type="text",nullable=true)
     */
    protected $abstract;

    /**
     * @var ArticleType
     * @ORM\ManyToOne(targetEntity="ArticleType")
     * @ORM\JoinColumn(name="type_id", referencedColumnName="id",nullable=false)
     */
    protected $type;

    /**
     * @var integer
     * @ORM\Column(name="begin_date_min_index", type="integer",nullable=true)
     */
    protected $beginDateMinIndex;

    /**
     * @var integer
     * @ORM\Column(name="begin_date_max_index", type="integer", nullable=true)
     */
    protected $beginDateMaxIndex;

    /**
     * @var DateType
     * @ORM\ManyToOne(targetEntity="DateType")
     * @ORM\JoinColumn(name="begin_date_type", referencedColumnName="id", nullable=true)
     */
    protected $beginDateType;

    /**
     * @var string
     * @ORM\Column(name="begin_date_label", type="string", nullable=true,length=50)
     */
    protected $beginDateLabel;

    /**
     * @var integer
     * @ORM\Column(name="end_date_min_index", type="integer",nullable=true)
     */
    protected $endDateMinIndex;

    /**
     * @var integer
     * @ORM\Column(name="end_date_max_index", type="integer", nullable=true)
     */
    protected $endDateMaxIndex;

    /**
     * @var DateType
     * @ORM\ManyToOne(targetEntity="DateType")
     * @ORM\JoinColumn(name="end_date_type", referencedColumnName="id", nullable=true)
     */
    protected $endDateType;

    /**
     * @var string
     * @ORM\Column(name="end_date_label", type="string", nullable=true,length=50)
     */
    protected $endDateLabel;

    /**
     * @var ArrayCollection
     * @ORM\OneToMany(targetEntity="ArticleLink", mappedBy="parent")
     */
    protected $links;

    /**
     * @var integer
     * @ORM\Column(name="first_rank_links_count", type="integer")
     */
    protected $firstRankLinksCount;

    /**
     * @var integer
     * @ORM\Column(name="second_rank_links_count", type="integer")
     */
    protected $secondRankLinksCount;

    /**
     * @var HResource
     * @ORM\ManyToOne(targetEntity="HResource")
     * @ORM\JoinColumn(name="detail_image_resource_id", referencedColumnName="id", nullable=true)
     */
    protected $detailImage;

    /**
     * @var ResourceGeometry
     * @ORM\ManyToOne(targetEntity="ResourceGeometry")
     * @ORM\JoinColumn(name="hb_resource_geometry_id", referencedColumnName="id", nullable=true)
     */
    protected $geometry;

    public function __toString()
    {
        return strval($this->id);
    }

    /**
     * Get id
     * @return int
     */
    public function getId() :?int
    {
        return (integer)$this->id;
    }

    /**
     * Get title
     * @return string
     */
    public function getTitle(){
        return $this->title;
    }

    /**
     * Set title
     * @param string $title
     * @return Article
     */
    public function setTitle($title){
        $this->title = $title;
        return $this;
    }

    /**
     * Get creationUser
     * @return User
     */
    public function getCreationUser(){
        return $this->creationUser;
    }

    /**
     * Set creationUser
     * @param User $creationUser
     * @return Article
     */
    public function setCreationUser($creationUser){
        $this->creationUser = $creationUser;
        return $this;
    }

    /**
     * @return User
     */
    public function getOwnerUser(): ?User
    {
        return $this->ownerUser;
    }

    /**
     * @param User $ownerUser
     * @return Article
     */
    public function setOwnerUser(?User $ownerUser): Article
    {
        $this->ownerUser = $ownerUser;
        return $this;
    }

    /**
     * Get creationDate
     * @return \DateTime
     */
    public function getCreationDate(){
        return $this->creationDate;
    }

    /**
     * Set creationDate
     * @param \DateTime $creationDate
     * @return Article
     */
    public function setCreationDate($creationDate){
        $this->creationDate = $creationDate;
        return $this;
    }

    /**
     * Get editionUser
     * @return User
     */
    public function getEditionUser(){
        return $this->editionUser;
    }

    /**
     * Set editionUser
     * @param User $editionUser
     * @return Article
     */
    public function setEditionUser($editionUser){
        $this->editionUser = $editionUser;
        return $this;
    }

    /**
     * Get editionDate
     * @return \DateTime
     */
    public function getEditionDate(){
        return $this->editionDate;
    }

    /**
     * Set editionDate
     * @param \DateTime $editionDate
     * @return Article
     */
    public function setEditionDate($editionDate){
        $this->editionDate = $editionDate;
        return $this;
    }

    /**
     * @return bool
     */
    public function getActive(): bool
    {
        return $this->active;
    }

    /**
     * @param bool $active
     * @return Article
     */
    public function setActive(bool $active): Article
    {
        $this->active = $active;
        return $this;
    }

    /**
     * Get abstract
     * @return string
     */
    public function getAbstract(){
        return $this->abstract;
    }

    /**
     * Set abstract
     * @param string $abstract
     * @return Article
     */
    public function setAbstract($abstract){
        $this->abstract = $abstract;
        return $this;
    }

    /**
     * Get type
     * @return ArticleType
     */
    public function getType(){
        return $this->type;
    }

    /**
     * Set type
     * @param ArticleType $type
     * @return Article
     */
    public function setType($type){
        $this->type = $type;
        return $this;
    }

    /**
     * @return int
     */
    public function getBeginDateMinIndex(): int
    {
        return $this->beginDateMinIndex;
    }

    /**
     * @param int $beginDateMinIndex
     * @return Article
     */
    public function setBeginDateMinIndex(int $beginDateMinIndex): Article
    {
        $this->beginDateMinIndex = $beginDateMinIndex;
        return $this;
    }

    /**
     * @return int
     */
    public function getBeginDateMaxIndex(): int
    {
        return $this->beginDateMaxIndex;
    }

    /**
     * @param int $beginDateMaxIndex
     * @return Article
     */
    public function setBeginDateMaxIndex(int $beginDateMaxIndex): Article
    {
        $this->beginDateMaxIndex = $beginDateMaxIndex;
        return $this;
    }

    /**
     * @return DateType
     */
    public function getBeginDateType()
    {
        return $this->beginDateType;
    }

    /**
     * @param DateType $beginDateType
     * @return Article
     */
    public function setBeginDateType(DateType $beginDateType): Article
    {
        $this->beginDateType = $beginDateType;
        return $this;
    }

    /**
     * @return string
     */
    public function getBeginDateLabel(): string
    {
        return $this->beginDateLabel;
    }

    /**
     * @param string $beginDateLabel
     * @return Article
     */
    public function setBeginDateLabel(string $beginDateLabel): Article
    {
        $this->beginDateLabel = $beginDateLabel;
        return $this;
    }

    /**
     * @return int
     */
    public function getEndDateMinIndex()
    {
        return $this->endDateMinIndex;
    }

    /**
     * @param int $endDateMinIndex
     * @return Article
     */
    public function setEndDateMinIndex($endDateMinIndex): Article
    {
        $this->endDateMinIndex = $endDateMinIndex;
        return $this;
    }

    /**
     * @return int
     */
    public function getEndDateMaxIndex()
    {
        return $this->endDateMaxIndex;
    }

    /**
     * @param int $endDateMaxIndex
     * @return Article
     */
    public function setEndDateMaxIndex($endDateMaxIndex): Article
    {
        $this->endDateMaxIndex = $endDateMaxIndex;
        return $this;
    }

    /**
     * @return DateType
     */
    public function getEndDateType()
    {
        return $this->endDateType;
    }

    /**
     * @param DateType $endDateType
     * @return Article
     */
    public function setEndDateType($endDateType): Article
    {
        $this->endDateType = $endDateType;
        return $this;
    }

    /**
     * @return string
     */
    public function getEndDateLabel()
    {
        return $this->endDateLabel;
    }

    /**
     * @param string $endDateLabel
     * @return Article
     */
    public function setEndDateLabel($endDateLabel): Article
    {
        $this->endDateLabel = $endDateLabel;
        return $this;
    }

    /**
     * @return HResource|null
     */
    public function getDetailImage(): ?HResource
    {
        return $this->detailImage;
    }

    /**
     * @param HResource|null $detailImage
     * @return Article
     */
    public function setDetailImage(?HResource $detailImage): Article
    {
        $this->detailImage = $detailImage;
        return $this;
    }

    /**
     * Get links
     * @return ArrayCollection
     */
    public function getLinks(){
        return $this->links;
    }

    /**
     * Add links
     * @param ArticleLink $link
     * @return self
     */
    public function addLink($link){
        $this->links[] = $link;
        return $this;
    }

    /**
     * @return int
     */
    public function getFirstRankLinksCount(): int
    {
        return $this->firstRankLinksCount;
    }

    /**
     * @param int $firstRankLinksCount
     * @return Article
     */
    public function setFirstRankLinksCount(int $firstRankLinksCount): Article
    {
        $this->firstRankLinksCount = $firstRankLinksCount;
        return $this;
    }

    /**
     * @return int
     */
    public function getSecondRankLinksCount(): int
    {
        return $this->secondRankLinksCount;
    }

    /**
     * @param int $secondRankLinksCount
     * @return Article
     */
    public function setSecondRankLinksCount(int $secondRankLinksCount): Article
    {
        $this->secondRankLinksCount = $secondRankLinksCount;
        return $this;
    }

    /**
     * @return ResourceGeometry
     */
    public function getGeometry(): ?ResourceGeometry
    {
        return $this->geometry;
    }

    /**
     * @param ResourceGeometry $geometry
     * @return Article
     */
    public function setGeometry(?ResourceGeometry $geometry): Article
    {
        $this->geometry = $geometry;
        return $this;
    }



}

