<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 23/06/18
 * Time: 14:59
 */

namespace App\Manager\File;


use Symfony\Component\HttpFoundation\File\UploadedFile;

interface FileUploader
{
    /**
     * upload a file to definitive storage location and returns the uri
     * @param UploadedFile $file
     * @return string
     * @throws \Exception
     */
public function upload(UploadedFile $file):string;

    /**
     * return root (local or distant) for file upload and storage
     * @return string
     */
public function getRoot():string;
}