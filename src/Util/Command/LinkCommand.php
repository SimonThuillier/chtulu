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
    /** @var DTOMutableEntity the entity subject of the action */
    private $entityToLink;

    /**
     * @param string $entityToLinkClassName className of the entity to link
     * @param int $idToLink the original id of the entity to link (can be negative for non already-existing entity)
     * @param string $linkerMethodName name of the subject entity setter method to be executed to perform the link
     * @return LinkCommand
     */
    public function defineLink(
        string $entityToLinkClassName,
        int $idToLink,
        string $linkerMethodName
    ): LinkCommand
    {
        $this->entityToLinkClassName = $entityToLinkClassName;
        $this->idToLink = $idToLink;
        $this->linkerMethodName = $linkerMethodName;
        
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
    
    
}