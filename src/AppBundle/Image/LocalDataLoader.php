<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 23/06/18
 * Time: 19:22
 */

namespace AppBundle\Image;


use AppBundle\Entity\ResourceFile;
use Liip\ImagineBundle\Binary\BinaryInterface;
use Liip\ImagineBundle\Binary\Loader\LoaderInterface;
use Liip\ImagineBundle\Model\Binary;

class LocalDataLoader implements LoaderInterface
{
    /**
     * @param mixed $resource
     * @return BinaryInterface
     * @throws \Exception
     */
    public function find($resource)
    {
        if(!$resource instanceof ResourceFile){
            throw new \Exception("Parameter isn't a valid ResourceFile entity");
        }
        /** @var ResourceFile $resource */

        //sleep(2);

        $data = file_get_contents($resource->getUri());
        $mime = $resource->getMimeType();
        $format = $resource->getType();

        return new Binary($data, $mime,$format);
    }
}