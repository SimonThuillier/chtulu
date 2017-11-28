<?php

namespace AppBundle\Listener;

use Symfony\Component\EventDispatcher\GenericEvent;

/**
 * Interface ListenerInterface
 * @package AppBundle\Listener
 */
interface ListenerInterface
{
    public function onProcess(GenericEvent $event);
}
