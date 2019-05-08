<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 23/06/18
 * Time: 15:42
 */

namespace App\Utils;


class FileUtil
{
    /**
     * this utilitary function cleans a given path (removing .. and .) and returns final path finished by /
     * @param $path
     * @return string
     */
    static function getNormalizedPath($path) :string
    {
        $finalPath = "";
        $pieces = explode("/",$path);
        $skipNext = 0;

        foreach(array_reverse($pieces) as $piece){
            if($piece === '..'){
                $skipNext++;
            }
            elseif($piece !== '.' && $piece !== ''){
                if($skipNext<1) {$finalPath = $piece . '/' . $finalPath;}
                else{$skipNext--;}
            }
        }
        $finalPath = '/' . $finalPath . '/';
        while($skipNext>0){
            $finalPath = '/../' . $finalPath;
            $skipNext--;
        }
        while(strpos($finalPath,'//') !== false){
            $finalPath = str_replace('//','/',$finalPath);
        }
        return $finalPath;
    }

    /**
     * this function check if a path exists and if not try to create it (recursively)
     * @param $path
     * @return bool
     */
    static function makePathIfNecessary($path) :bool
    {
        if (file_exists($path)) {return true;}

        $path = self::getNormalizedPath($path);
        $pieces = explode("/",$path);

        $depth = 0;
        while(! file_exists($path)){
            $path = '/' . join('/',array_slice($pieces,0,-$depth-1));
            $depth++;
        }
        $depth--;

        try{
            while($depth>0){
                $path = '/' . join('/',array_slice($pieces,0,-$depth));
                mkdir($path,0775);
                $depth--;
            }
        }
        catch(\Exception $e){
            return false;
        }
        return true;
    }
}