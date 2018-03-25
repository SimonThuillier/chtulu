<?php

namespace AppBundle\Controller;

use AppBundle\Mediator\ArticleDTOMediator;
use AppBundle\Mediator\NotAvailableGroupException;
use AppBundle\Mediator\NullColleagueException;
use AppBundle\DTO\ArticleDTO;
use AppBundle\Entity\Article;
use AppBundle\Entity\DateType;
use AppBundle\Form\ArticleDTOType;
use AppBundle\Form\TestType;
use AppBundle\Test;
use AppBundle\Utils\HDate;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;

class TestController extends Controller
{

    /**
     * @Route("/test", name="testpage")
     * @Template()
     */
    public function testAction(Request $request)
    {
        /** @var Session $session */
        $session = $this->get('session');

        //if(!$session->has("msg")) $session->set("msg","truc");

        $test = new Test();
        $test->setTitle('lol');

        $hDate = new HDate();
        $hDate->setBeginDate(new \DateTime())->setEndDate(new \DateTime());
        $hDate->setType($this->getDoctrine()->getRepository(DateType::class)->find(DateType::PRECISE));
        $test->setHDate($hDate);

        $form = $this->get('form.factory')->createBuilder(TestType::class)
            ->add('save',SubmitType::class)
            ->setData($test)->getForm();

        //var_dump($request->getMethod());
        //$session->set("msg",$test->getHDate());

        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            if ($form->isValid()) {


            }
            $session->set("msg",$test->getHDate()->getBeginDate()->format("Y-m-d H:i:s"));
            return $this->redirectToRoute("testpage");
        }

        // replace this example code with whatever you need
        return array("form"=>$form->createView(),"msg"=>$session->get("msg","truc"));
    }

    /**
     * @Route("/test-article", name="testarticle")
     * @Template()
     * @throws NotAvailableGroupException
     * @throws NullColleagueException
     */
    public function testArticleAction(Request $request, ArticleDTOMediator $mediator)
    {
        /** @var Session $session */
        $session = $this->get('session');

        $doctrine = $this->getDoctrine();

        $article = $doctrine->getRepository(Article::class)
            ->find(1);

        $groups = ['minimal','abstract','date'];

        $DTO = new ArticleDTO();

        $articleDTO = $mediator
            ->setDTO($DTO)
            ->setEntity($article)
            ->setDTOGroups($groups)
        ->getDTO();

        $formFactory = $this->get('form.factory');

        $form = $formFactory
            ->createBuilder(ArticleDTOType::class,$articleDTO,['validation_groups'=>$groups])
            ->add('save',SubmitType::class,["attr"=>["method"=>"POST"]])
            ->getForm();

        //var_dump($request->getMethod());
        //$session->set("msg",$test->getHDate());

        $form->handleRequest($request);
        var_dump($request->getMethod());
        if ($form->isSubmitted()) {
            var_dump("je suis soumise");
            if ($form->isValid()) {
                var_dump($mediator->getChangedProperties());
                // var_dump($DTO->getEndHDate());
                $mediator->returnDataToEntity();
                //throw new \Exception("lol");
                $doctrine->getManager()->flush();
            }
            return array("form"=>$form->createView(),"msg"=>"");
        }

        // replace this example code with whatever you need
        return array("form"=>$form->createView(),"msg"=>"");
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
