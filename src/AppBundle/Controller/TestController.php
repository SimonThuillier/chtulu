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
use AppBundle\Utils\ArrayUtil;
use AppBundle\Utils\HDate;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;

/**
 * Class TestController
 * @package AppBundle\Controller
 */
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

        $credentials = $this->getParameter('hb_credentials');
        //var_dump($credentials);


        $lol = ["a","b"=>["c"=>"d","e"=>["f","g"]]];

        $lol2 = ArrayUtil::flatten(null);
        $subArray = [];
        $lol2 = ArrayUtil::flatten($lol,$subArray);

        var_dump($lol2);
        var_dump($subArray);


        // replace this example code with whatever you need
        return array("msg"=>$session->get("msg","truc"));
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
            ->mapDTOGroups($groups)
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

    /**
     * @Route("/dtos-mapping", name="test_dtos_mapping")
     * @throws \Exception
     * @Template()
     */
    public function dtosMappingAction(Request $request){

        $articleDTO = new \ReflectionClass(ArticleDTO::class);
        $methods = $articleDTO->getMethods(\ReflectionMethod::IS_PUBLIC);
        $getters = array_filter($methods,function($item){
            return (preg_match("#^get#",$item->name) == 1) &&
                !in_array($item->name,["getGroups","getMediator"]);
        });

        $annotations = array_map(function(\ReflectionMethod $item){
            $groups = [];
            $matches = [];
            if(preg_match("#@Groups\({(?<groups>[^}]+)}\)#i",
                    str_replace(" ","",$item->getDocComment()),$matches) == 1){
                $groups = explode(",",str_replace("\"","",$matches["groups"]));
            }

            return ["name"=>lcfirst(substr($item->name,3)),"groups" => $groups];
        },$getters);

        $mapping = array();

        foreach ($annotations as $annotation){
            foreach($annotation["groups"] as $group){
                $mapping[$group] = array_merge(isset($mapping[$group])?$mapping[$group]:[],
                    [$annotation["name"]]);
            }
        }

        $d=4;

        $dtosMapping = [
            ["arg"=>ArticleDTO::class,"result" => json_encode($mapping)]
        ];



        return array("dtosMapping"=>$dtosMapping);
    }
}
