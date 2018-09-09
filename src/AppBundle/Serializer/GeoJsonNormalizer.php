<?php
namespace AppBundle\Serializer;

use AppBundle\Utils\Geometry;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use AppBundle\Factory\HDateFactory;
use AppBundle\Utils\HDate;
use AppBundle\Helper\DateHelper;
use AppBundle\Entity\DateType;

class GeoJsonNormalizer extends HNormalizer
{
    private $allowedTypes;
    const MAX_DEPTH=4;

    public function __construct()
    {
        parent::__construct([]);

        $this->allowedTypes = ["POINT","POLYGON","LINESTRING","GEOMETRYCOLLECTION","MULTILINESTRING","MULTIPOLYGON"];

        //$this->normRegex = "#^(POINT|POLYGON|LINESTRING|GEOMETRYCOLLECTION|MULTILINESTRING|MULTIPOLYGON)\([\d|\.|\-|\s|[:space:]|\,|\(|\)|POINT|POLYGON|LINESTRING|GEOMETRYCOLLECTION|MULTILINESTRING|MULTIPOLYGON]+\)$#";
    }

    public function supportsNormalization($data, $format = null)
    {
        return is_object($data) && get_class($data) === Geometry::class;

        //return (is_scalar($data) && preg_match($this->normRegex, trim($data)) == 1);
    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        if(!is_array($data) || count($data)!==2) return false;
        if(!array_key_exists("type",$data) ||
            (!array_key_exists("coordinates",$data) && !array_key_exists("geometries",$data))){
            return false;
        }
        if(!in_array(strtoupper($data["type"]),$this->allowedTypes)) return false;

        return true;
    }

    /**
     * @param string $data
     * @return bool
     */
    private function stringSupportsNormalization(string $data):bool
    {
        return (is_scalar($data) && preg_match($this->normRegex, trim($data)) == 1);
    }

    /**
     * @param mixed $data
     * @param array|null $groups
     * @param array $context
     * @return array
     * @throws InvalidArgumentException
     */
    public function normalize($data,$groups=null,array $context=[])
    {
        if(is_object($data)) $data = $data->getValue();
        $normalization = ["type"=>null];
        $greatRegex = "#^(?<type>[[:alpha:]]*)\((?<coordinates>[\d|\.|\-|\s|[:space:]|\,]+)\)$#";
        $greatRegex = "#^(?<type>[[:alpha:]]*)\((?<sub>.+)\)$#";
        $matches = [];
        if(preg_match($greatRegex, trim($data),$matches) != 1){
            throw new InvalidArgumentException("Unable to normalize to GeoJSON '" . $data . "'");
        }
        if(! in_array(strtoupper($matches["type"]),$this->allowedTypes)){
            throw new InvalidArgumentException("Unknown GeoJSON type '" . $matches["type"] . "'");
        }

        $normalization["type"] = ucfirst(strtolower($matches["type"]));

        $nonCollectionRegex = "#^[\d|\.|\-|\s|[:space:]|\,|\(|\)]+$#";
        if(preg_match($nonCollectionRegex, $matches["sub"]) == 1){
            $normalization["coordinates"] = $this->normalizeCoordinates($matches["sub"]);
        }
        else{
            $normalization["geometries"] = [];
            $sub = preg_replace("#\)\s*\,\s*(\w)#","),\%\$&_$1",$matches["sub"]);
            foreach(explode(",\%\$&_",$sub) as $subSub){
                //var_dump($subSub);
                $normalization["geometries"][] = $this->normalize($subSub);
            }
        }

        return $normalization;
    }

    private function normalizeCoordinates($data,$depth=1){
        if($depth>self::MAX_DEPTH) return ["MAX_DEPTH_REACHED"];
        $coordinates = [];

        $greatRegex = "#^[\d|\.|\-|\s|[:space:]|\,]+$#";
        $hasReachedMaxDepth = (preg_match($greatRegex, trim($data)) == 1);
        //var_dump($hasReachedMaxDepth);

        if($hasReachedMaxDepth){
            $coordinates = explode(",",trim($data));
            $smallRegex = "#^(?<lat>[\d|.|-]+) (?<lng>[\d|.|-]+)$#";
            $coordinates = array_map(function($item) use($smallRegex){
                $matches = [];
                preg_match($smallRegex, trim($item),$matches);
                return [floatval($matches["lat"]),floatval($matches["lng"])];
            },$coordinates);
            if(count($coordinates) === 1){
                return reset($coordinates);
            }
            else{
                return $coordinates;
            }
        }

        $coordinates = [];
        $data =trim($data);

        // handling multiple nesting level
        $nestingLevel = self::MAX_DEPTH;
        $maxLevelFound = false;
        $regex = "";
        $replace = "";
        $exploder="_\_"; // just to give a value
        while(!$maxLevelFound && $nestingLevel>0){
            $regex = "#([\d])\s*" . str_repeat("\)\s*",$nestingLevel) . "\," .
                str_repeat("\s*\(",$nestingLevel) . "\s*([\d|-])#";
            if(preg_match($regex, $data) == 1) $maxLevelFound=true;
            $replace = "$1\$" . str_repeat(")",$nestingLevel) . "," . str_repeat("(",$nestingLevel) . "\$$2";
            $exploder = "\$" . str_repeat(")",$nestingLevel) . "," . str_repeat("(",$nestingLevel) . "\$";
            $nestingLevel--;
        }


        $data = preg_replace($regex,$replace,$data);
        var_dump($data);
        $subs = explode($exploder,$data);
        foreach($subs as $sub){
            $sub = trim($sub);
            if($sub[0] !== '(') $sub = '(' . $sub;
            if($sub[strlen($sub)-1] !== ')') $sub = $sub . ')';
            // var_dump($sub);
            $subRegex = "#^\((?<sub>.+)\)$#";
            $matches = [];
            preg_match($subRegex, $sub,$matches);
            $coordinates[] = $this->normalizeCoordinates($matches["sub"],$depth+1);
        }
        return $coordinates;
    }

    /**
     * @param mixed $data
     * @param string $class
     * @param null $format
     * @param array $context
     * @return Geometry
     * @throws InvalidArgumentException
     */
    public function denormalize($data, $class, $format = null, array $context = array())
    {
        $value = strtoupper($data["type"]) ."(";

        if(isset($data["geometries"])){
            $i=0;
            foreach($data["geometries"] as $subGeo){
                $value .= (($i>0?',':'') . $this->denormalize($subGeo,null)->getValue());
                $i++;
            }
        }
        elseif(is_array($data["coordinates"][0])) {
            $i=0;
            foreach($data["coordinates"] as $subGeo){
                $value .= (($i>0?',':'') . $this->denormalizeCoordinates($subGeo) . '');
                $i++;
            }
        }
        else{
            $value .= ($this->denormalizeCoordinates($data["coordinates"]));
        }

        $value .= ")";
        return new Geometry($value);
    }

    private function denormalizeCoordinates($data,$depth=1){

        if($depth>self::MAX_DEPTH) return "MAX_DEPTH_REACHED";
        //var_dump()
        if(is_scalar(reset($data))){
            return (strval($data[0] . ' ' . $data[1]));
        }
        else{
            $value ='(';
            $i = 0;
            foreach($data as $sub){
                $value .= (($i>0?',':'') . $this->denormalizeCoordinates($sub,$depth+1));
                    $i++;
            }
            $value .= ')';
            return $value;
        }
    }
}