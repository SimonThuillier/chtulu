<?php

use AppBundle\Entity\DateType;
use AppBundle\Utils\HDate;
use AppBundle\Helper\DateHelper;
use AppBundle\Mapper\AutoMapper;

require ('../Utils/HDate.php');
require ('../Utils/Numbers_Roman.php');
require ('../Mapper/AutoMapper.php');
require ('../Entity/DateType.php');
require ('../Helper/DateHelper.php');

$type = new DateType();

$hDate=new HDate();
$hDate->setBeginDate(DateHelper::createFromFormat('d/m/Y','5/9/-1546'));
$hDate->setEndDate(DateHelper::createFromFormat('d/m/Y','5/9/-1546')->modify('+1 month'));
$hDate->setType($type);

echo "TEST 1";
var_dump($hDate);
echo "TEST 2";
var_dump((array) $hDate);
echo "TEST 3";
var_dump(array_keys((array) $hDate));
echo "TEST 4";
var_dump(get_object_vars($hDate));
echo "TEST 5";
var_dump(get_class_methods(get_class($hDate)));

echo "TEST 6";
var_dump(AutoMapper::getReadableStructure($hDate));
echo "TEST 7";
var_dump(method_exists($hDate,'gettest'));
echo "TEST 8";
$fields = ["beginDate","endDate"];
var_dump(array_flip($fields));
echo "TEST 9";
$fields = ["beginDate"=>0,"endDate"=>1];
$fields2 = ["lolBeginDate"=>2,"lol"=>3,"lolEndDate"=>5,"lolType"=>6];
var_dump(AutoMapper::autoMap($hDate, $fields2,'','lol',['endDate']));
var_dump($hDate);
var_dump($fields2);
echo "TEST 10";
echo "\r\n";
for($i=1;$i<9;$i++){
    $type->setId($i);
    var_dump($hDate->__toString());
    echo "\r\n";
}
echo "\r\n";
