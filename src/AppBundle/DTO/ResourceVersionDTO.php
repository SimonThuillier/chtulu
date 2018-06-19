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
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

class ResourceVersionDTO extends EntityMutableDTO
{
    /** @var integer */
    protected $id;
    /** @var string */
    protected $name;
    /** @var UploadedFile */
    protected $file;

    /**
     * ResourceVersionDTO constructor.
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
     * @return string|null
     * @Groups({"minimal"})
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @param string|null $name
     * @return self
     */
    public function setName(?string $name): ResourceVersionDTO
    {
        $this->name = $name;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('name');
        return $this;
    }

    /**
     * @return UploadedFile|null
     */
    public function getFile(): ?UploadedFile
    {
        return $this->file;
    }

    /**
     * @param UploadedFile|null $file
     * @return ResourceVersionDTO
     */
    public function setFile(?UploadedFile $file): ResourceVersionDTO
    {
        $this->file = $file;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('file');
        return $this;
    }
}