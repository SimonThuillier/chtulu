<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 22:59
 */

namespace App\DTO;

use App\Entity\PopType;
use App\Util\Geometry;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

class PopDTO extends EntityMutableDTO
{
    /** @var PopType */
    protected $type;
    /** @var Geometry */
    protected $targetGeometry;
    /** @var string */
    protected $zoomGeometry;
    /** @var string */
    protected $comment;
    /** @var integer */
    protected $number;

    /**
     * PopDTO constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @Groups({"minimal"})
     * @return PopType
     */
    public function getType(): ?PopType
    {
        return $this->type;
    }

    /**
     * @param PopType $type
     * @return PopDTO
     */
    public function setType(?PopType $type): PopDTO
    {
        $this->type = $type;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('type');
        return $this;
    }

    /**
     * @Groups({"minimal"})
     * @return int
     */
    public function getNumber(): int
    {
        return $this->number;
    }

    /**
     * @param int $number
     * @return PopDTO
     */
    public function setNumber(int $number): PopDTO
    {
        $this->number = $number;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('number');
        return $this;
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
     * @return PopDTO
     */
    public function setTargetGeometry(Geometry $targetGeometry): PopDTO
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
     * @return PopDTO
     */
    public function setZoomGeometry($zoomGeometry): PopDTO
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
     * @return PopDTO
     */
    public function setComment(?string $comment): PopDTO
    {
        $this->comment = $comment;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('comment');
        return $this;
    }
}