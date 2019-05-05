<?php

namespace App\Controller;

use App\DTO\EntityMutableDTO;
use App\Factory\DTOFactory;
use App\Helper\WAOHelper;
use App\Helper\SimpleEntityHelper;
use App\Mediator\ArticleDTOMediator;
use App\Mediator\NotAvailableGroupException;
use App\Mediator\NullColleagueException;
use App\DTO\ArticleDTO;
use App\Entity\Article;
use App\Entity\DateType;
use App\Form\ArticleDTOType;
use App\Form\TestType;
use App\Test;
use App\Utils\ArrayUtil;
use App\Utils\HDate;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;

/**
 * Class TestController
 * @package App\Controller
 * @Route("/test")
 */
class TestController extends AbstractController
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

        //var_dump($lol2);
        //var_dump($subArray);


        // replace this example code with whatever you need
        return array("msg"=>$session->get("msg","truc"));
    }

    /**
     * @Route("/waos-mapping", name="test_waos_mapping")
     * @throws \Exception
     * @Template()
     */
    public function waosMappingAction(Request $request,
                                      WAOHelper $waoHelper)
    {
        $dtoClasses = $waoHelper->getDTOClassNames();
        $dtosMapping=[];
        $dtosStructure=[];
        foreach($dtoClasses as $class){
            $dtosMapping[] = ["arg"=>$waoHelper->getAbridgedName($class),
                "result" => json_encode($waoHelper->getDTOMapping($class))];

            $dtoStructure = $waoHelper->getDTOStructure($class);
            foreach($dtoStructure as $name => $returnType){
                $dtoStructure[$name] = $waoHelper->getAbridgedName($returnType);
            }
            $dtosStructure[] = ["arg"=>$waoHelper->getAbridgedName($class),"result" => json_encode($dtoStructure)];
        }

        $simpleEntityClasses = $waoHelper->getSimpleEntityClassNames();
        $simpleEntitiesMapping=[];
        foreach($simpleEntityClasses as $class){
            $simpleEntitiesMapping[] = ["arg"=>$waoHelper->getAbridgedName($class),
                "result" => json_encode($waoHelper->getEntityMapping($class))];
        }

        return array(
            "dtosMapping"=>$dtosMapping,
            "dtosStructure"=>$dtosStructure,
            "simpleEntitiesMapping"=>$simpleEntitiesMapping
        );
    }
}
