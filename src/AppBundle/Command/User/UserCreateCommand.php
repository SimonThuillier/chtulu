<?php

namespace AppBundle\Command\User;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Helper\QuestionHelper;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;
use AppBundle\Manager\UserManager;
use Doctrine\Common\Persistence\ManagerRegistry;

class UserCreateCommand extends ContainerAwareCommand
{
    private $manager;
    private $doctrine;
    private $validator;
    /** HE\User $user */
    private $user;
    
    public function __construct(UserManager $manager,ManagerRegistry $doctrine)
    {
        parent::__construct();
        $this->doctrine = $doctrine;
        $this->manager = $manager;
    }
    
    
    protected function configure()
    {
        $this
            ->setName('hbase:user:create')
            ->setDescription('Create new user for HBase application')
            ->addArgument('username', InputInterface::OPTIONAL, 'The username of the user.','')
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
        $this->user->setPlainPassword($password);
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
            $this->doctrine->getManager()->persist($this->user);
            $this->doctrine->getManager()->flush();
            $output->writeln('--- User succesfully created ! ---');
        }
        catch(\Exception $e){
            $output->writeln('Error : '. $e->getMessage());
        }
    }

}
