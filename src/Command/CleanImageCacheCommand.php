<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 05/09/18
 * Time: 21:29
 */

namespace App\Command;


use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\HttpKernel\KernelInterface;

class CleanImageCacheCommand extends ContainerAwareCommand
{
    private $doctrine;
    private $rootDir;

    public function __construct(ManagerRegistry $doctrine,KernelInterface $kernel)
    {
        $this->doctrine = $doctrine;
        $this->rootDir=$kernel->getRootDir();

        parent::__construct();
    }




    protected function configure()
    {
        $this
            ->setName('hbase:cache:clean-image')
            ->setDescription('Removes all in directory public/media/cache')
            ->setHelp('Removes all in directory public/media');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $dir = $this->rootDir . "/../public/media/cache/";
        $di = new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS);
        $ri = new \RecursiveIteratorIterator($di, \RecursiveIteratorIterator::CHILD_FIRST);

        $directoryCount = 0;
        $fileCount = 0;
        foreach ( $ri as $file ) {
            if($file->isDir()){
                rmdir($file);
                $directoryCount++;
            }
            else{
                unlink($file);
                $fileCount++;
            }
        }

        $output->writeln([
            'OK, ' . $directoryCount . ' removed directories, '. $fileCount . ' removed files'
        ]);
    }
}