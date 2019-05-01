<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 30/06/18
 * Time: 00:20
 */

namespace App\Serializer;


use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;

class HGetSetMethodNormalizer extends GetSetMethodNormalizer
{
use HAbstractObjectNormalizerTrait;
}