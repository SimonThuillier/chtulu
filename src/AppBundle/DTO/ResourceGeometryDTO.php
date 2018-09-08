<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 22:59
 */

namespace AppBundle\DTO;

use AppBundle\Entity\ResourceType;
use AppBundle\Utils\UrlBag;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

class ResourceGeometryDTO extends EntityMutableDTO
{
    /** @var integer */
    protected $id;
    /** @var geometry */
    protected $targetGeometry;
    /** @var geometry */
    protected $zoomGeometry;
    /** @var string */
    protected $comment;


    /**
     * ArticleDTO constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->versions = [];
    }

    /**
     * @return int
     * @Groups({"minimal"})
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int
     * @return self
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @Groups({"minimal"})
     * @Assert\NotNull()
     * @return geometry
     */
    public function getTargetGeometry()
    {
        return $this->targetGeometry;
    }

    /**
     * @param geometry $targetGeometry
     * @return ResourceGeometryDTO
     */
    public function setTargetGeometry($targetGeometry): ResourceGeometryDTO
    {
        $this->targetGeometry = $targetGeometry;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('targetGeometry');
        return $this;
    }

    /**
     * @Groups({"minimal"})
     * @return geometry
     */
    public function getZoomGeometry()
    {
        return $this->zoomGeometry;
    }

    /**
     * @param geometry $zoomGeometry
     * @return ResourceGeometryDTO
     */
    public function setZoomGeometry($zoomGeometry): ResourceGeometryDTO
    {
        $this->zoomGeometry = $zoomGeometry;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('zoomGeometry');
        return $this;
    }

    /**
     * @Groups({"minimal"})
     * @return string
     */
    public function getComment(): ?string
    {
        return $this->comment;
    }

    /**
     * @param string $comment
     * @return ResourceGeometryDTO
     */
    public function setComment(?string $comment): ResourceGeometryDTO
    {
        $this->comment = $comment;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('comment');
        return $this;
    }
}