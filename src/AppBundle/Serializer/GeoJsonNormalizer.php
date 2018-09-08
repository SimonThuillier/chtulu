<?php
namespace AppBundle\Serializer;

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
    private $normRegex;

    public function __construct()
    {
        parent::__construct([]);
        $this->normRegex = "#^(POINT|POLYGON|LINESTRING|GEOMETRYCOLLECTION|MULTILINESTRING|MULTIPOLYGON)\([\d|\.|\-|\s|[:space:]|\,|\(|\)|POINT|POLYGON|LINESTRING|GEOMETRYCOLLECTION|MULTILINESTRING|MULTIPOLYGON]+\)$#";
    }

    public function supportsNormalization($data, $format = null)
    {
        return (is_scalar($data) && preg_match($this->normRegex, trim($data)) == 1);
    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        return count($data)===2 && isset($data['type']) && isset($data['coordinates']);
    }

    /**
     * @param string $data
     * @param array|null $groups
     * @param array $context
     * @return array
     * @throws InvalidArgumentException
     */
    public function normalize($data,$groups=null,array $context=[])
    {
        $normalization = ["type"=>null];
        $greatRegex = "#^(?<type>[[:alpha:]]*)\((?<coordinates>[\d|\.|\-|\s|[:space:]|\,]+)\)$#";
        $matches = [];
        if(preg_match($greatRegex, trim($data),$matches) != 1){
            throw new InvalidArgumentException("Unable to normalize to GeoJSON '" . $data . "'");
        }
        $normalization["type"] = ucfirst(strtolower($matches["type"]));

        $coordinates = explode(",",$matches["coordinates"]);
        $coordinates = array_map(function($item) use($greatRegex){
            $matches = [];
            if($item)
            $matches = [];
            $smallRegex = "#^(?<lat>[\d|.|-]+) (?<lng>[\d|.|-]+)$#";
            if(preg_match($smallRegex, trim($item),$matches) != 1){
                throw new InvalidArgumentException("Unable to normalize to GeoJSON '" . $item . "'");
            }
            return [floatval($matches["lat"]),floatval($matches["lng"])];
        },$coordinates);

        if(count($coordinates) === 1){
            $normalization["coordinates"] = reset($coordinates);
        }
        else{
            $normalization["coordinates"] = $coordinates;
        }



        return $normalization;
    }

    /**
     * @param mixed $data
     * @param string $class
     * @param null $format
     * @param array $context
     * @return mixed
     * @throws InvalidArgumentException
     */
    public function denormalize($data, $class, $format = null, array $context = array())
    {
        try{
            $data["beginDate"] = DateHelper::createFromJson($data["beginDate"]);
            $data["endDate"] = DateHelper::createFromJson($data["endDate"]);
            $data["type"] = $this->doctrine->getRepository(DateType::class)
                ->find(intval($data["type"]));
        }
        catch(\Exception $e){
            throw new InvalidArgumentException("Invalid argument for transformation while deserializing to " .
                HDate::class . " :  " . $e->getMessage());
        }
        try{
            $object = $this->mainFactory->create($data["type"],$data["beginDate"], $data["endDate"]);

        }
        catch(\Exception $e){
            throw new InvalidArgumentException("Error while deserializing onto '" .
                HDate::class . "' object :  " . $e->getMessage());
        }
        return $object;
    }
}