<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 15/05/18
 * Time: 00:25
 */

namespace AppBundle\Serializer;


use Symfony\Component\Serializer\Encoder\DecoderInterface;
use Symfony\Component\Serializer\Encoder\EncoderInterface;

class UrlEncoder implements EncoderInterface,DecoderInterface
{
    const FORMAT = 'url';

    public function __construct()
    {
    }

    /**
     * {@inheritdoc}
     */
    public function encode($data, $format='url', array $context = array())
    {
        $url = '?';
        if($data === null || !is_array($data) || count($data)<1){return '';}
        foreach ($data as $key => $value){
            $url .= ($key . '=' . $value . '&');
        }
        return substr($url,0,-1);
    }

    /**
     * {@inheritdoc}
     */
    public function decode($data, $format='url', array $context = array())
    {
        $data = urldecode($data);
        if(strpos($data, '?') === false) return [];
        $parameterString = explode('?',$data)[1];
        $rawParameters = explode('&',$parameterString);

        $parameters = [];

        foreach($rawParameters as $parameter){
            $separation = explode('=',$parameter);
            $parameters[$separation[0]] = $separation[1];
        }
        return $parameters;
    }

    /**
     * {@inheritdoc}
     */
    public function supportsEncoding($format)
    {
        return self::FORMAT === $format;
    }

    /**
     * {@inheritdoc}
     */
    public function supportsDecoding($format)
    {
        return self::FORMAT === $format;
    }

}