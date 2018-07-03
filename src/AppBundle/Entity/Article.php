<?php

/**
 *
 */

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Article
 * @author Belze
 * @ORM\Table(name="hb_article")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ArticleRepository")
 * @UniqueEntity(fields="title", message="Another article named {{ value }} exists. Consider editing it instead or rename your article.")
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
     * @ORM\Column(name="title", type="string", length=50)
     */
    protected $title;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User",inversedBy="createdArticles")
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
     * @var string
     * @ORM\Column(name="abstract", type="string", length=2000)
     */
    protected $abstract;

    /**
     * @var ArticleType
     * @ORM\ManyToOne(targetEntity="ArticleType")
     * @ORM\JoinColumn(name="type_id", referencedColumnName="id")
     */
    protected $type;

    /**
     * @var string
     * @ORM\Column(name="content", type="text", nullable=true)
     */
    protected $content;

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
     * @var string
     * @ORM\Column(name="hte_range", type="string", nullable=true,length=255)
     */
    protected $hteRange;

    /**
     * @var array
     * @ORM\Column(name="domain", type="simple_array",nullable=true)
     */
    protected $domain=array(0,0,0,0,0,0,0,0); // all 0 by default

    /**
     * @var ArrayCollection
     * @ORM\OneToMany(targetEntity="ArticleLink", mappedBy="parentArticle")
     */
    protected $links;

    /**
     * @var HResource
     * @ORM\ManyToOne(targetEntity="HResource")
     * @ORM\JoinColumn(name="detail_image_resource_id", referencedColumnName="id", nullable=true)
     */
    protected $detailImage;

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
     * Get content
     * @return string
     */
    public function getContent(){
        return $this->content;
    }

    /**
     * Set content
     * @param string $content
     * @return Article
     */
    public function setContent($content){
        $this->content = $content;
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
     * @return string
     */
    public function getHteRange(): ?string
    {
        return $this->hteRange;
    }

    /**
     * @param string $hteRange
     * @return Article
     */
    public function setHteRange(?string $hteRange): Article
    {
        $this->hteRange = $hteRange;
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
     * Get domain
     * @return array
     */
    public function getDomain(){
        return $this->domain;
    }

    /**
     * domain
     * @param string $domain
     * @return Article
     */
    public function setDomain($domain){
        $this->domain = $domain;
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

}

