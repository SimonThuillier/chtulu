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
     * @param mixed $fromObject
     * @throws NotAvailablePartException
     * @throws NullDTOException
     * @return self
     */
    public function buildPart(String $part,$fromObject){
        if($this->DTO === null){
            throw new NullDTOException("DTO is not instanciated : it must be instanciated to build parts");
        }
        if(! in_array($part,$this->availableParts)){
            throw new NotAvailablePartException("Part " . $part . " is not available for DTO " . get_class($this->DTO));
        }
        return $this;
    }

    /**
     * @param string $part
     * @param mixed $toObject
     * @throws NotAvailablePartException
     * @throws NullDTOException
     * @return self
     */
    public function returnPart(String $part,$toObject){
        if($this->DTO === null){
            throw new NullDTOException("DTO is not instanciated : it must be instanciated to return parts");
        }
        if(! in_array($part,$this->availableParts)){
            throw new NotAvailablePartException("Part " . $part . " is not available for DTO " . get_class($this->DTO));
        }
        return $this;
    }
}