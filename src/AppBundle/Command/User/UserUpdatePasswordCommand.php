<?php

namespace AppBundle\Command\User;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Helper\QuestionHelper;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;
use AppBundle\Service\UserManager;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity as HE;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\ConstraintViolationList;
use Symfony\Component\Validator\ConstraintViolationInterface;
use AppBundle\Entity\User;

class UserUpdatePasswordCommand extends ContainerAwareCommand
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
            ->setName('hbase:user:update-password')
            ->setDescription('Admin command to reset existing user password')
            ->addArgument('username', InputArgument::OPTIONAL, 'The username of the user.','');
    }
    
    protected function interact(InputInterface $input,OutputInterface $output){
        $output->writeln('--- HBase admin password update ---');
        $helper = $this->getHelper('question');
        QuestionHelper::disableStty();
        
        $this->user = $this->em->getRepository('AppBundle:User')->findOneBy(array("username" => $input->getArgument('username')));
        while($this->user === null || ! $this->user instanceof User){
            $output->writeln("Error : User with username '" . $input->getArgument('username') . "' cannot be found.");
            $input->setArgument('username', $helper->ask($input, $output, new Question('username : ')));
            $this->user = $this->em->getRepository('AppBundle:User')->findOneBy(array("username" => $input->getArgument('username')));
        }
        $output->writeln("--- User found ---");
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
            $this->em->flush();
            $output->writeln('--- User password succesfully updated ! ---');
        }
        catch(\Exception $e){
            $output->writeln('Error : '. $e->getMessage());
        }
    }

}
