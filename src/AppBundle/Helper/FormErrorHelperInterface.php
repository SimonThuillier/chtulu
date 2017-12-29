<?php

namespace AppBundle\Helper;

use Symfony\Component\Form\FormErrorIterator;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Interface FormErrorHelperInterface
 * @package AppBundle\Helper
 */
interface FormErrorHelperInterface
{
    /**
     * @param FormErrorIterator $formErrorIterator
     * @return JsonResponse
     */
    public function jsonResponse(FormErrorIterator $formErrorIterator):JsonResponse;
}
