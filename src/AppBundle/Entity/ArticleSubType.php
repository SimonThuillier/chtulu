<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM; 
use Symfony\Component\Serializer\Annotation\Groups;
use AppBundle\Repository\ArticleSubTypeRepository;

/**
 * ArticleSubType
 * @author Belze
 * @ORM\Table(name="article_sub_type")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ArticleSubTypeRepository")
 */
class ArticleSubType
{
    const EVENT_SHORT=1;
    const EVENT_MEDIUM=2;
    const EVENT_LONG=3;
    
    
    /**
     * @var int
     * @ORM\Column(name="id", type="bigint")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Groups("group1")
     */
    private $id;

    /**
     * @var string
     * @ORM\Column(name="label", type="string", length=50, unique=true)
     * @Groups("group1")
     */
    private $label;
    
    /**
     * @var ArticleType
     * @ORM\ManyToOne(targetEntity="ArticleType",inversedBy="subTypes")
     * @ORM\JoinColumn(name="type_id", referencedColumnName="id")
     */
    private $type;
    
    public function __toString()
    {
        return $this->label;
    }


    /**
     * Get id
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set label
     * @param string $label
     * @return ArticleSubType
     */
    public function setLabel($label)
    {
        $this->label = $label;

        return $this;
    }

    /**
     * Get label
     * @return string
     */
    public function getLabel()
    {
        return $this->label;
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
     * @return ArticleSubType
     */
    public function setType($type){
        $this->type = $type;
        return $this;
    }
}

