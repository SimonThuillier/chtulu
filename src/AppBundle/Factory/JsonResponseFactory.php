<?php

namespace AppBundle\Factory;

use Symfony\Component\HttpFoundation\JsonResponse;

class JsonResponseFactory implements JsonResponseFactoryInterface
{
    public function newInstance(array $message, $status):JsonResponse
    {
        return new JsonResponse($message, $status);
    }
}
