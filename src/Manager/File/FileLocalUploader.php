<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 23/06/18
 * Time: 15:12
 */

namespace App\Manager\File;


use App\Util\FileUtil;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class FileLocalUploader implements FileUploader
{
    /**
     * @var ContainerInterface
     */
private $container;
    /**
     * @var string
     */
private $root;

    /**
     * FileLocalUploader constructor.
     * @param ContainerInterface $container
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->root = FileUtil::getNormalizedPath($this->container->getParameter("hb_resources")["file_system"]["root"]);
    }

    /**
     * @param UploadedFile $file
     * @return string
     * @throws \Exception
     */
    public function upload(UploadedFile $file): string
    {
        $path = $this->getStorePath($file);
        if(! FileUtil::makePathIfNecessary($path)){
            throw new \Exception("Impossible to create storage path " . $path);
        }
        $fileName = md5(uniqid()).'.'.$file->guessExtension();
        $tempFilePath = $file->getPathname();
        copy($tempFilePath,$path . $fileName);
        unlink($tempFilePath);
        return $path . $fileName;
    }

    public function getRoot(): string
    {
        return $this->root;
    }

    /**
     * @param UploadedFile $file
     * @return string
     */
    private function getStorePath(UploadedFile $file):string{
        $now = new \DateTime();
        return FileUtil::getNormalizedPath($this->root . '/' . $now->format('Ymd') . '/');
    }
}