<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Constraints\Date;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     * @Template()
     */
    public function indexAction(Request $request)
    {
        // replace this example code with whatever you need
        return array();
    }
    
    /**
     * @Route("/test-calendar", name="calendar")
     * @Template()
     */
    public function testCalendarAction(Request $request)
    {
        $number = 1;
        $datenum = jdtogregorian ($number);
        
        $strDate = '2/9/-4512';
        $number2 = gregoriantojd(11, 25, -5500);
        
        $date = (new \DateTime())->setDate(-10983,11,25);
        
        
        
        return $this->render('::debug.html.twig', array(
            'debug' => array(
                'date' => $datenum,
                'number2' => $number2,
                'datedate' => $date
            )
        ));
    }
}
