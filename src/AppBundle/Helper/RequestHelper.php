<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 23/11/18
 * Time: 20:04
 */

namespace AppBundle\Helper;

use Symfony\Component\HttpFoundation\Request;

class RequestHelper
{
    /**
     * @var WAOHelper
     */
    private $waoHelper;

    /**
     * ServerHelper constructor.
     * @param WAOHelper $waoHelper
     */
    public function __construct(WAOHelper $waoHelper)
    {
        $this->waoHelper = $waoHelper;
    }

    /**
     * check if get new request is valid and returns the data
     * @param Request $request
     * @return array
     * @throws \Exception
     */
    public function handleGetNewRequest(Request $request)
    {
        $result = ["waoType"=>null];

        if (0 !== strpos($request->headers->get('Content-Type'), 'application/json')) {
            throw new \Exception("Request Content-Type must be application/json for GetNew request");
        }

        if(! $request->query->has("type")) throw new \Exception("Type parameter is mandatory for Get New request");
        $dtoClassName = $this->waoHelper->guessClassName($request->query->get("type"));
        if(! $this->waoHelper->isDTO($dtoClassName))
            throw new \Exception($request->query->has("type") . " is not a known DTO");

        $result["waoType"] = $request->query->get("type");

        return $result;
    }

    /**
     * check if post request is valid and returns the data
     * @param Request $request
     * @return array
     * @throws \Exception
     */
    public function handlePostRequest(Request $request)
    {
        $result = ["senderKey"=>null,"waos"=>[]];
        if (0 !== strpos($request->headers->get('Content-Type'), 'application/json')) {
            throw new \Exception("Request Content-Type must be application/json for Post request");
        }
        /** @var array $data */
        $data = json_decode($request->getContent(), true);
        if(!$data) throw new \Exception("Post request data is null");
        if(! array_key_exists("senderKey",$data)) throw new \Exception("senderKey attribute is mandatory for Post data");
        if(! array_key_exists("_token",$data)) throw new \Exception("_token attribute is mandatory for Post data");
        if(! array_key_exists("waos",$data)) throw new \Exception("waos attribute is mandatory for Post data");
        if(! is_array($data["waos"])) throw new \Exception("waos attribute must be an associative array");

        $result["_token"] = $data["_token"];
        $result["senderKey"] = $data["senderKey"];
        $result["waos"] = $data["waos"];

        foreach($result["waos"] as $waoType => $waoData){
            if(! $this->waoHelper->isDTO($this->waoHelper->guessClassName($waoType)))
                throw new \Exception($waoType . " is not a known DTO");
            if(! is_array($waoData))
                throw new \Exception("waos.". $waoType . " must be an associative array of entities keyed by their ids");
            foreach($waoData as $id => $value){
                if(!is_integer($id))
                    throw new \Exception("waos.". $waoType . "'s id '". $id . "' is not an integer");
                if(!is_array($value))
                    throw new \Exception("waos.". $waoType . "'s data is not an associative array [property=>value]");
                if(!array_key_exists("postedGroups",$value))
                    throw new \Exception("waos.". $waoType . "'s data must have a 'postedGroups' property");
            }
        }
        return $result;
    }
}