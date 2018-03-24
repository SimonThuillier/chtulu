<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:49
 */

namespace AppBundle\Builder;


use AppBundle\DTO\DTO;

abstract class DTOBuilder
{
    /** @var DTO */
    protected $DTO;
    /** @var array */
    protected $availableParts;

    /**
     * DTOBuilder constructor.
     */
    public function __construct()
    {
        $this->availableParts = [];
    }

    /**
     * @param DTO $DTO
     * @return $this
     */
    public function setDTO($DTO){
        $this->DTO = $DTO;
        $this->availableParts = [];
        if($DTO !== null) $this->availableParts = array_keys($DTO->getParts());
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDTO(){
        return $this->DTO;
    }

    /**
     * @param string $part
     * @param mixed $object
     * @throws NotAvailablePartException
     * @throws NullDTOException
     */
    public function buildPart(String $part,$object){
        if($this->DTO === null){
            throw new NullDTOException("DTO is not instanciated : it must be instanciated to build parts");
        }
        if(! in_array($part,$this->availableParts)){
            throw new NotAvailablePartException("Part " . $part . " is not available for DTO " . get_class($this->DTO));
        }
    }
}