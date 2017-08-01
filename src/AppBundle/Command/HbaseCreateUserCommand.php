<?php

namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Helper\QuestionHelper;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;
use AppBundle\Service\UserManager;
use Doctrine\ORM\EntityManager;

class HbaseCreateUserCommand extends ContainerAwareCommand
{
    private $manager;
    private $em;
    
    public function __construct(UserManager $manager,EntityManager $em)
    {
        parent::__construct();
        $this->manager = $manager;
    }
    
    
    protected function configure()
    {
        $this
            ->setName('hbase:create:user')
            ->setDescription('Create new user for HBase application')
            ->addOption(
                'iterations',
                null,
                InputOption::VALUE_REQUIRED,
                'How many times should the message be printed?',
                1
                )
            ->addArgument('username', InputArgument::OPTIONAL, 'The username of the user.')
            ->addArgument('firstname', InputArgument::OPTIONAL, 'The firstname of the user.')
            ->addArgument('lastname', InputArgument::OPTIONAL, 'The lastname of the user.')
        ;
    }
    
    protected function interact(InputInterface $input,OutputInterface $output){
        $helper = $this->getHelper('question');
        QuestionHelper::disableStty();
        $output->writeln($this->manager->isValidUsername('test2'));
        $output->writeln($this->manager->isValidEmail('test2'));
        
        if ($input->getArgument('username') === null) {
            $question = new Question('username : ', null);
            $question->setValidator(function ($answer) {
                if (!is_string($answer) || 'Bundle' !== substr($answer, -6)) {
                    throw new \RuntimeException(
                        'The name of the bundle should be suffixed with \'Bundle\''
                        );
                }
                
                return $answer;
            });
                $name = $helper->ask($input, $output, $question);
            
            
        }
        
        
        
    }
    

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->interact($input,$output);
        // $argument = $input->getArgument('argument');


        $output->writeln('Command result.');
    }

}
