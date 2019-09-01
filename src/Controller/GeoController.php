<?php

namespace App\Controller;

use App\DTO\ResourceGeometryDTO;
use App\Entity\ResourceGeometry;
use App\Factory\MediatorFactory;
use App\Manager\ReactTranspiler;
use App\Mapper\ResourceGeometryMapper;
use App\Mediator\ResourceGeometryDTOMediator;
use App\Serializer\GeoJsonNormalizer;
use App\Util\Geometry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;

/**
 * Class GeoController
 * @package App\Controller
 * @Route("/geo")
 */
class GeoController extends AbstractController
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
     * @Route("/test-react-router1", name="geo_testreactrouter1")
     * @Template()
     */
    public function testReactRouter1Action(Request $request)
    {
        /** @var Session $session */
        $session = $this->get('session');
        return array();
    }

    /**
     * @Route("/test-react-router2", name="geo_testreactrouter2")
     * @Template()
     */
    public function testReactRouter2Action(Request $request)
    {
        /** @var Session $session */
        $session = $this->get('session');
        return array();
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
        $mediator = $mediatorFactory->create(ResourceGeometryDTO::class);

        /** @var ResourceGeometryDTO $geoDto */
        $geoDto = $mediator
            ->mapDTOGroups(array_merge($groups,[]))
            ->getDTO();

        // $geoDto->setTargetGeometry("POINT(37.4220761 -122.0845187)");

        //$mapper->add($geoDto);

        $geos = $mapper->getFindAllQB()->getQuery()->execute();
        /** @var ResourceGeometry $geo */
        $geo = $geos[0];
        // var_dump($geo->getTargetGeometry());

        $normTests = [
            "POINT(37.4220761 -122.0845187)","LINESTRING(45.786 -12.786,41.8767345 3.4)",
            "POLYGON((0 1,10 2,9 4))","POLYGON((0 1,10 2,9 4),(1 1,1 2,2 2))",
            "GEOMETRYCOLLECTION(POINT(2 0),POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))",
            "MULTILINESTRING((0 0,1 1,1 2),(2 3,3 2,5 4))",
            "MULTIPOLYGON(((0 0,4 0,4 4,0 4,0 0),(1 1,2 1,2 2,1 2,1 1)), ((-1 -1,-1 -2,-2 -2,-2 -1,-1 -1)))"];
        $normRes = array_map(function($item) use($normalizer){
            $geometry = new Geometry($item);
            $support = $normalizer->supportsNormalization($geometry);
            return ["arg"=>$geometry->getValue(),
                "support"=>$support,
                "result" => $support ?json_encode($normalizer->normalize($geometry)):""];
        },$normTests);

        $denormTests = ["	{\"type\":\"Point\",\"coordinates\":[37.4220761,-122.0845187]}",
            "	{\"type\":\"Geometrycollection\",\"geometries\":[{\"type\":\"Point\",\"coordinates\":[2,0]},{\"type\":\"Polygon\",\"coordinates\":[[[0,0],[1,0],[1,1],[0,1],[0,0]]]}]}",
            "{\"type\":\"Multipolygon\",\"coordinates\":[[[[0,0],[4,0],[4,4],[0,4],[0,0]],[[1,1],[2,1],[2,2],[1,2],[1,1]]],[[[-1,-1],[-1,-2],[-2,-2],[-2,-1],[-1,-1]]]]}",
            "{\"type\":\"Polygon\",\"coordinates\":[[[0,1],[10,2],[9,4]],[[1,1],[1,2],[2,2]]]}"];
        $denormRes = array_map(function($item) use($normalizer){
            $decoded = json_decode($item,true);
            // var_dump($decoded);
            $support = $normalizer->supportsDenormalization($decoded,null);
            return ["arg"=>$item,
                "support"=>$support,
                "result" => $support ?json_encode($normalizer->denormalize($decoded,null)->getValue()):""];
        },$denormTests);



        return array("normRes"=>$normRes,"denormRes"=>$denormRes);
    }
}
