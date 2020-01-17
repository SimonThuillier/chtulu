<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 23/06/18
 * Time: 20:36
 */

namespace App\Manager\File;


use App\Entity\ResourceFile;
use App\Entity\ResourceVersion;
use App\Image\LocalDataLoader;
use Liip\ImagineBundle\Binary\Loader\LoaderInterface;
use Liip\ImagineBundle\Imagine\Cache\Resolver\ResolverInterface;
use Liip\ImagineBundle\Imagine\Filter\FilterManager;
use Liip\ImagineBundle\Service\FilterService;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Routing\RouterInterface;

class FileRouter
{
    /** @var LoaderInterface */
    private $loader;
    /** @var ResolverInterface */
    private $cacheResolver;
    /** @var FilterManager */
    private $filterManager;

    /**
     * FileRouter constructor.
     * @param ContainerInterface $container
     */
    public function __construct(ContainerInterface $container,
                                LocalDataLoader $loader)
    {
        $this->loader = $loader;
        $this->filterManager = $container->get('liip_imagine.filter.manager');
        $this->cacheResolver = $container->get('liip_imagine.cache.resolver.local');
    }

    public function getVersionRoute(ResourceVersion $version,$filter=null)
    {
        $file= $version->getFile();

        $wantedPath =
            $version->getResource()->getId() . '-' .
            $version->getResource()->getName() .
            '-' .$version->getNumber() .
            (($file->getType() && $file->getType() !== "")? '.' . $file->getType():"");




        try{
            $route = $this->cacheResolver->
            resolve($wantedPath,$filter);
            if($this->cacheResolver->isStored($wantedPath,$filter)) return $route;

            $binary = $this->loader->find($version->getFile());
            $filters = $this->filterManager->getFilterConfiguration()->all();
            if($filter && $filter !== "") $binary = $this->filterManager->applyFilter($binary,$filter);

            $this->cacheResolver->store($binary,$wantedPath,$filter);
        }
        catch(\Exception $e){
            var_dump($e);
        }




        return $route;
    }


}