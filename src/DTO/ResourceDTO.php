<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 22:59
 */

namespace App\DTO;

use App\Entity\ResourceType;
use App\Util\UrlBag;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

class ResourceDTO extends EntityMutableDTO
{
    /** @var string */
    protected $name;
    /** @var ResourceType */
    protected $type;
    /** @var ResourceVersionDTO */
    protected $activeVersion;
    /** @var array */
    protected $versions;
    /** @var array */

    /**
     * ArticleDTO constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->versions = [];
    }

    /**
     * @return string
     * @Groups({"minimal"})
     * @Assert\NotBlank()
     * @Assert\NotNull()
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @param string $name
     * @return self
     */
    public function setName(string $name): ResourceDTO
    {
        $this->name = $name;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('name');
        return $this;
    }

    /**
     * @return ResourceType
     * @Groups({"minimal"})
     */
    public function getType(): ResourceType
    {
        return $this->type;
    }

    /**
     * @param ResourceType $type
     * @return self
     */
    public function setType(ResourceType $type): ResourceDTO
    {
        $this->type = $type;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('type');
        return $this;
    }

    /**
     * @return ResourceVersionDTO
     * @Groups({"activeVersion"})
     */
    public function getActiveVersion(): ResourceVersionDTO
    {
        return $this->activeVersion;
    }

    /**
     * @param ResourceVersionDTO $activeVersion
     * @return ResourceDTO
     */
    public function setActiveVersion(ResourceVersionDTO $activeVersion): ResourceDTO
    {
        $this->activeVersion = $activeVersion;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('activeVersion');
        return $this;
    }

    /**
     * @return array
     * @Groups({"versions"})
     */
    public function getVersions(): array
    {
        return $this->versions;
    }

    /**
     * @param array $versions
     * @return ResourceDTO
     */
    public function setVersions(array $versions): ResourceDTO
    {
        $this->versions = $versions;
        if($this->mediator !== null) $this->mediator->notifyChangeOfProperty('versions');
        return $this;
    }


}