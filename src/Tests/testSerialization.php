<?php

use App\Entity\DateType;
use App\Helper\DateHelper;
use App\Utils\HDate;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\EncoderInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/SerializerInterface.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/Normalizer/NormalizerInterface.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/Normalizer/DenormalizerInterface.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/SerializerAwareInterface.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/SerializerAwareTrait.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/Normalizer/SerializerAwareNormalizer.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/Normalizer/AbstractNormalizer.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/Normalizer/AbstractObjectNormalizer.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/Encoder/EncoderInterface.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/Encoder/DecoderInterface.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/Serializer.php');

require ('../../../vendor/symfony/symfony/src/Symfony/Component/PropertyAccess/Exception/ExceptionInterface.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/PropertyAccess/Exception/InvalidArgumentException.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/Exception/ExceptionInterface.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/Exception/UnexpectedValueException.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/Exception/RuntimeException.php');

require ('../../../vendor/symfony/symfony/src/Symfony/Component/Inflector/Inflector.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/PropertyAccess/PropertyAccessorInterface.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/PropertyAccess/PropertyAccessorBuilder.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/PropertyAccess/PropertyAccessor.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/PropertyAccess/PropertyPathInterface.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/PropertyAccess/PropertyAccess.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/PropertyAccess/PropertyPath.php');

require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/Encoder/ChainEncoder.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/Encoder/ChainDecoder.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/Encoder/JsonDecode.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/Encoder/JsonEncode.php');
require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/Encoder/EncoderInterface;.php');

require ('../../../vendor/symfony/symfony/src/Symfony/Component/Serializer/Normalizer/ObjectNormalizer.php');


require ('../Utils/HDate.php');
require ('../Utils/Numbers_Roman.php');
require ('../Mapper/AutoMapper.php');
require ('../Entity/DateType.php');
require ('../Helper/DateHelper.php');


$type = new DateType();
$type->setId(3);

$hDate=new HDate();
$hDate->setBeginDate(DateHelper::createFromFormat('d/m/Y','5/9/-1546'));
$hDate->setEndDate(DateHelper::createFromFormat('d/m/Y','5/9/-1546')->modify('+1 month'));
$hDate->setType($type);


echo "TEST 2\r\n";
var_dump($hDate->toJSON($hDate));
echo "\r\n";


$payload= '{"beginDate":"-000056-08-31T22:00:00.000Z","endDate":"-000056-09-29T22:00:00.000Z","type":"3"}';

$encoders = array(new EncoderInterface;());
$normalizers = array(new ObjectNormalizer());
$serializer = new Serializer($normalizers,$encoders);
$array = [];
$test = $serializer->decode($payload, 'json',
    $array);

echo "TEST 1\r\n";
var_dump($test);
echo "\r\n";

/** @var HDate */
$test2 = $serializer->denormalize($test, HDate::class);

echo "TEST 2\r\n";
var_dump($test2);
$date = DateHelper::createFromJson($test2->getBeginDate());
echo $date->format('d/m/Y');
echo "\r\n";
echo json_encode($date);
