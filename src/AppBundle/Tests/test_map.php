<?php

use AppBundle\Utils\HDate;
use AppBundle\Mapper\SimpleMapper;

require ('../Utils/HDate.php');
require ('../Mapper/SimpleMapper.php');

$hDate=new HDate();
$hDate->setBeginDate(new \DateTime());
$hDate->setEndDate((new \DateTime())->modify('+1 day'));

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
var_dump(SimpleMapper::getReadableStructure($hDate));
echo "TEST 7";
var_dump(method_exists($hDate,'gettest'));