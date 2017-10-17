<?php

namespace AppBundle\EventListener;

use Symfony\Component\EventDispatcher\GenericEvent;

/**
 * Interface ListenerInterface
 * @package AppBundle\EventListener
 */
interface ListenerInterface
{
    public function onProcess(GenericEvent $event);
}
