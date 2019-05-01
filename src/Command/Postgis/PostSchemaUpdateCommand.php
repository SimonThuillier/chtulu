<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 05/09/18
 * Time: 21:29
 */

namespace App\Command\Postgis;


use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\HttpKernel\KernelInterface;

class PostSchemaUpdateCommand extends ContainerAwareCommand
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
            ->setName('hbase:postgis:post-schema-update')
            ->setDescription('Redefines id sequences on Postgis DB after a Doctrine schema update')
            ->setHelp('Redefines id sequences on Postgis DB after a Doctrine schema update');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $filePath = str_replace('[ROOT]',$this->rootDir . '/../', '[ROOT]/sql/post-schema-update-psql.sql');
        $sql = file_get_contents ( $filePath);

        $result = $this->doctrine->getConnection()->exec($sql);

        $output->writeln([
            $result
        ]);
    }
}