<?php

namespace AppBundle\Controller;

use AppBundle\DTO\ResourceGeometryDTO;
use AppBundle\Entity\ResourceGeometry;
use AppBundle\Factory\MediatorFactory;
use AppBundle\Manager\ReactTranspiler;
use AppBundle\Mapper\ResourceGeometryMapper;
use AppBundle\Mediator\ResourceGeometryDTOMediator;
use AppBundle\Serializer\GeoJsonNormalizer;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;

/**
 * Class GeoController
 * @package AppBundle\Controller
 * @Route("/geo")
 */
class GeoController extends Controller
{
    /**
     * @Route("/test", name="geo_testpage")
     * @Template()
     */
    public function testAction(Request $request)
    {
        /** @var Session $session */
        $session = $this->get('session');

        return array();
    }

    /**
     * @Route("/react", name="geo_testpage")
     * @Template()
     */
    public function reactAction(Request $request,ReactTranspiler $transpiler)
    {
        /** @var Session $session */
        $session = $this->get('session');

        //$cmd = $transpiler->test1();

        return array('cmd'=>'yolo');
    }

    /**
     * @Route("/test-static-insert", name="geo_teststaticinsert")
     * @throws \Exception
     * @Template()
     */
    public function testStaticInsertAction(Request $request,
                                           MediatorFactory $mediatorFactory,
                                           ResourceGeometryMapper $mapper,
                                            GeoJsonNormalizer $normalizer){

        $groups = ['minimal'];
        $mediator = $mediatorFactory->create(ResourceGeometryDTOMediator::class);

        /** @var ResourceGeometryDTO $geoDto */
        $geoDto = $mediator
            ->mapDTOGroups(array_merge($groups,[]))
            ->getDTO();

        $geoDto->setTargetGeometry("POINT(37.4220761 -122.0845187)");

        //$mapper->add($geoDto);

        $geos = $mapper->getFindAllQB()->getQuery()->execute();
        /** @var ResourceGeometry $geo */
        $geo = $geos[0];
        // var_dump($geo->getTargetGeometry());

        $normTests = ["POINT(37.4220761 -122.0845187)","LINESTRING(45.786 -12.786,41.8767345 3.4)",
            "POLYGON((0 1,10 2,9 4),(1 1,1 2,2 2))",
            "GEOMETRYCOLLECTION(POINT(2 0),POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))"];
        $normRes = array_map(function($item) use($normalizer){
            $support = $normalizer->supportsNormalization($item);
            return ["arg"=>$item,
                "support"=>$support,
                "result" => $support ?json_encode($normalizer->normalize($item)):""];
        },$normTests);

        return array("normRes"=>$normRes);
    }
}
