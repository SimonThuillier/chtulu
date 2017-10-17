<?php

namespace AppBundle\Processor;

use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\GenericEvent;

class GenericProcessor implements ProcessorInterface
{
    const EVENT_NAME = 'process';
    /**
     * @var EventDispatcher
     */
    protected $dispatcher;

    /**
     * @var GenericEvent
     */
    protected $event;

    /**
     * GenericProcessor constructor.
     */
    public function __construct()
    {
        $this->dispatcher = new EventDispatcher();
        $this->event      = new GenericEvent();
    }

    /**
     * @param     $eventName
     * @param     $listener
     */
    public function addListener($eventName, $listener)
    {
        $this->dispatcher->addListener($eventName, $listener);
    }

    /**
     * @param EventSubscriberInterface $subscriber
     */
    public function addSubscriber(EventSubscriberInterface $subscriber)
    {
        $this->dispatcher->addSubscriber($subscriber);
    }

    /**
     * @return array
     */
    public function process()
    {
        $this->dispatcher->dispatch(self::EVENT_NAME, $this->event);

        return $this->event->getArguments();
    }
}
