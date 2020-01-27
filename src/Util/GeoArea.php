<?php
namespace App\Util;

/**
 *
 * @author belze
 * Class for areas (scopes on map) with {zoom,center:{lat,lng}}
 */
class GeoArea
{
    /**
     * @var array
     */
    private $center;

    /**
     * @var integer
     */
    private $zoom;

    /**
     * @return \App\Util\GeoArea
     */
    public function __construct()
    {
        $this->zoom = 0;
        $this->center=["lat"=>0,"lng"=>0];

        return $this;
    }

    /**
     * @return array
     */
    public function getCenter(): array
    {
        return $this->center;
    }

    /**
     * @param array $center
     * @return GeoArea
     */
    public function setCenter(array $center): GeoArea
    {
        $this->center = $center;
        return $this;
    }

    /**
     * @return int
     */
    public function getZoom(): int
    {
        return $this->zoom;
    }

    /**
     * @param int $zoom
     * @return GeoArea
     */
    public function setZoom(int $zoom): GeoArea
    {
        $this->zoom = $zoom;
        return $this;
    }


    /**
     * @param GeoArea $geoArea
     * @return string
     */
    static public function toJson(GeoArea $geoArea){
        $array = ["center"=>$geoArea->getCenter(),"zoom"=>$geoArea->getZoom()];
        return json_encode($array);
    }
}