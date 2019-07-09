<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 22:59
 */

namespace App\DTO;

use App\Entity\ResourceType;
use App\Utils\Geometry;
use App\Utils\UrlBag;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

class ResourceGeometryDTO extends EntityMutableDTO
{
    /** @var Geometry */
    protected $targetGeometry;
    /** @var string */
    protected $zoomGeometry;
    /** @var string */
    protected $comment;

    /**
     * ResourceGeometryDTO constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @Groups({"minimal"})
     * @Assert\NotNull()
     * @return geometry
     */
    public function getTargetGeometry(): ?Geometry
    {
        return $this->targetGeometry;
    }

    /**
     * @param Geometry $targetGeometry
     * @return ResourceGeometryDTO
     */
    public function setTargetGeometry(Geometry $targetGeometry): ResourceGeometryDTO
    {
        $this->targetGeometry = $targetGeometry;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('targetGeometry');
        return $this;
    }

    /**
     * @Groups({"minimal"})
     * @return string
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

    public function getReturnGroups(){
        return ["minimal"];
    }
}