<?php

namespace AppBundle\Factory;

use Symfony\Component\HttpFoundation\JsonResponse;

class JsonResponseFactory
{
    public function create(array $message, $status):JsonResponse
    {
        return new JsonResponse($message, $status);
    }
}
