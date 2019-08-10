<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 07/08/19
 * Time: 23:44
 */

namespace App\Util\Command;


use App\Entity\DTOMutableEntity;

/**
 * Class LinkCommand
 * @package App\Command
 * subEntityMapperCommand representing a link action, e.g. edit with a foreign key in database
 */
class LinkCommand extends EntityMapperCommand
{
    /** @var string className of the entity to link */
    private $entityToLinkClassName;
    /** @var int the original id of the entity to link (can be negative for non already-existing entity) */
    private $idToLink;
    /** @var string name of the subject entity setter method to be executed to perform the link */
    private $linkerMethodName;
    /** @var bool if true the link must be established before the entity is added to the DB, else it is optional */
    private $mandatory;
    /** @var DTOMutableEntity the entity subject of the action */
    private $entityToLink;

    /**
     * @param string $entityToLinkClassName className of the entity to link
     * @param int $idToLink the original id of the entity to link (can be negative for non already-existing entity)
     * @param string $linkerMethodName name of the subject entity setter method to be executed to perform the link
     * @param bool $mandatory
     * @return LinkCommand
     */
    public function defineLink(
        string $entityToLinkClassName,
        int $idToLink,
        string $linkerMethodName,
        bool $mandatory
    ): LinkCommand
    {
        $this->entityToLinkClassName = $entityToLinkClassName;
        $this->idToLink = $idToLink;
        $this->linkerMethodName = $linkerMethodName;
        $this->mandatory = $mandatory;
        
        return $this;
    }

    /**
     * @param DTOMutableEntity $entityToLink
     * @return LinkCommand
     */
    public function setEntityToLink(DTOMutableEntity $entityToLink): LinkCommand
    {
        $this->entityToLink = $entityToLink;
        return $this;
    }

    /**
     * @return string
     */
    public function getEntityToLinkClassName(): string
    {
        return $this->entityToLinkClassName;
    }

    /**
     * @return int
     */
    public function getIdToLink(): int
    {
        return $this->idToLink;
    }

    /**
     * @return string
     */
    public function getLinkerMethodName(): string
    {
        return $this->linkerMethodName;
    }

    /**
     * @return bool
     */
    public function isMandatory(): bool
    {
        return $this->mandatory;
    }

    /**
     * @return DTOMutableEntity|null
     */
    public function getEntityToLink(): ?DTOMutableEntity
    {
        return $this->entityToLink;
    }

    public function finishAndClear()
    {
        parent::finishAndClear();
        $this->entityToLink = null;
    }
}