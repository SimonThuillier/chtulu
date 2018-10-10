<?php

namespace AppBundle\Controller;

use AppBundle\DTO\EntityMutableDTO;
use AppBundle\Factory\DTOFactory;
use AppBundle\Helper\DTOHelper;
use AppBundle\Helper\SimpleEntityHelper;
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
 * @Route("/test")
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
     * @Route("/waos-mapping", name="test_waos_mapping")
     * @throws \Exception
     * @Template()
     */
    public function waosMappingAction(Request $request,
                                      DTOHelper $DTOHelper,
                                      SimpleEntityHelper $simpleEntityHelper)
    {
        $dtoClasses = $DTOHelper->getDTOClassNames();
        $dtosMapping=[];
        $dtosStructure=[];
        foreach($dtoClasses as $class){
            $dtosMapping[] = ["arg"=>$DTOHelper->getAbridgedName($class),
                "result" => json_encode($DTOHelper->getDTOMapping($class))];

            $dtoStructure = $DTOHelper->getDTOStructure($class);
            $dtoStructure = array_map(function(array $item) use ($DTOHelper){

                return [$item["name"] => $DTOHelper->getAbridgedName($item["returnType"])];
            },$dtoStructure);
            $dtosStructure[] = ["arg"=>$DTOHelper->getAbridgedName($class),"result" => json_encode($dtoStructure)];
        }

        $simpleEntityClasses = $simpleEntityHelper->getEntityClassNames();
        $simpleEntitiesMapping=[];
        foreach($simpleEntityClasses as $class){
            $simpleEntitiesMapping[] = ["arg"=>$DTOHelper->getAbridgedName($class),
                "result" => json_encode($simpleEntityHelper->getEntityMapping($class))];
        }

        return array(
            "dtosMapping"=>$dtosMapping,
            "dtosStructure"=>$dtosStructure,
            "simpleEntitiesMapping"=>$simpleEntitiesMapping
        );
    }

    /**
     * @Route("/react-router/{sub}", name="test_react_router",requirements={"page"="\w+"})
     * @throws \Exception
     * @Template()
     */
    public function reactRouterAction(Request $request)
    {
        return array();
    }
}
