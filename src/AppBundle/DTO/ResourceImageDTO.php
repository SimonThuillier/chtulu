<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 22:59
 */

namespace AppBundle\DTO;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

class ResourceImageDTO extends ResourceVersionDTO
{
    /** @var UploadedFile */
    protected $file;

    /**
     * @return UploadedFile|null
     * @Groups({"file"})
     * @Assert\NotBlank()
     * @Assert\NotNull()
    *  @Assert\Image(
     *     minWidth = 120,
     *     maxWidth = 2000,
     *     minHeight = 100,
     *     maxHeight = 1200
     * )
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