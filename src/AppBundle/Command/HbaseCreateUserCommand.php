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
use AppBundle\Entity as HE;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\ConstraintViolationList;
use Symfony\Component\Validator\ConstraintViolationInterface;

class HbaseCreateUserCommand extends ContainerAwareCommand
{
    private $manager;
    private $em;
    private $validator;
    /** HE\User $user */
    private $user;
    
    public function __construct(UserManager $manager,EntityManager $em)
    {
        parent::__construct();
        $this->em = $em;
        $this->manager = $manager;
    }
    
    
    protected function configure()
    {
        $this
            ->setName('hbase:create:user')
            ->setDescription('Create new user for HBase application')
            ->addArgument('username', InputArgument::OPTIONAL, 'The username of the user.','')
            ->addArgument('email', InputArgument::OPTIONAL, 'Email of the user.','');
    }
    
    protected function interact(InputInterface $input,OutputInterface $output){
        $output->writeln('--- HBase user creation ---');
        $helper = $this->getHelper('question');
        QuestionHelper::disableStty();
        
        $this->user = $this->manager->create($input->getArgument('username'),$input->getArgument('email'));
        $errors = $this->manager->validate($this->user);
        while(count($errors)>0){
            /** ConstraintViolationInterface $ error */
            foreach($errors as $error){
                $output->writeln("Error : " . $error->getMessage());
            }
            $input->setArgument('username', $helper->ask($input, $output, new Question('username : ')));
            $input->setArgument('email', $helper->ask($input, $output, new Question('email : ')));
            
            $this->user->setUsername($input->getArgument('username'));
            $this->user->setEmail($input->getArgument('email'));
            $errors = $this->manager->validate($this->user);
        }
        $output->writeln("--- Username and Email ok ---");
        // handle password entry
        $password = $helper->ask($input, $output, (new Question('Password : '))->setHidden(true));
        $passwordBis = $helper->ask($input, $output, (new Question('Retype password : '))->setHidden(true));
        $this->user->setPassword($password);
        $errors = $this->manager->validate($this->user);
        while($password !== $passwordBis || count($errors)>0){
            if($password !== $passwordBis){
                $output->writeln("Error : passwords don't match.");
            }
            else{
                $output->writeln("Error : " . $errors[0]->getMessage());
            }
            $password = $helper->ask($input, $output, (new Question('Password : '))->setHidden(true));
            $passwordBis = $helper->ask($input, $output, (new Question('Retype password : '))->setHidden(true));
            $this->user->setPlainPassword($password);
            $errors = $this->manager->validate($this->user);
        }   
    }
    

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        try{
            $this->manager->encodePassword($this->user);
            $errors = $this->manager->validate($this->user);
            $output->writeln(var_dump($errors));
            $this->em->persist($this->user);
            $this->em->flush();
            $output->writeln('--- User succesfully created ! ---');
        }
        catch(\Exception $e){
            $output->writeln('Error : '. $e->getMessage());
        }
    }

}
