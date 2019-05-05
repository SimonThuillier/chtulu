<?php

namespace App\Controller;

use App\Entity\DateType;
use App\Form\TestType;
use App\Test;
use App\Utils\HDate;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Validator\Constraints\Date;

class DefaultController extends AbstractController
{
    /**
     * main controller for loading the spa
     * TODO : check for auth and no-auth redirecting
     * @Route("/app/{sub}", name="homepage",requirements={"page"="\w+"})
     * @throws \Exception
     * @Template()
     */
    public function indexAction(Request $request)
    {
        // replace this example code with whatever you need
        return array();
    }
}
