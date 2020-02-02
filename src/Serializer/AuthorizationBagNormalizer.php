<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 07/04/18
 * Time: 20:05
 */

namespace App\Serializer;


use App\Util\AuthorizationBag;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;


class AuthorizationBagNormalizer implements NormalizerInterface
{
    /**
     * handles authorization bao ject which should not be denormalized
     * MediatorNormalizer constructor.
     */
    public function __construct()
    {

    }

    public function supportsNormalization($data, $format = null)
    {
        return (is_object($data) && strpos(strtoupper(get_class($data)),"AUTHORIZATIONBAG") !== false);

    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        return false;
    }

    /**
     * @inheritdoc
     */
    public function normalize($object,$groups=null,array $context=[])
    {
        /** @var AuthorizationBag $object */
        return $object->asArray();
    }

    /**
     * @inheritdoc
     */
    public function denormalize($data, $class, $format = null, array $context = array())
    {
        return $data;
    }
}