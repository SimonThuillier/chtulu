<?php

namespace AppBundle\Helper;

use Symfony\Component\Serializer\SerializerInterface;
use AppBundle\DTO\ArticleCollectionDTO;
use AppBundle\DTO\ArticleModalDTO;
use AppBundle\Factory\ArticleDTOFactory;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Doctrine\Common\Annotations\AnnotationReader;

class StaticHelper
{
    /**
     * genrically map at runtime an array to corresponding object properties
     * @param array $array
     * @param mixed $object
     */
    static function mapArrayToObject($array,$object)
    {
        $class= get_class($object);
        foreach($array as $key => $value) {
            if(property_exists($class, $key)){
                $object->$key = $value;
            }
        }
    }
}