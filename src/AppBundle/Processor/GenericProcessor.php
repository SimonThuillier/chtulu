<?php

namespace AppBundle\Processor;

use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\HttpFoundation\Request;

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
     *  @return self
     */
    public function addListener($eventName, $listener)
    {
        $this->dispatcher->addListener($eventName, $listener);
        return $this;
    }

    /**
     * @param EventSubscriberInterface $subscriber
     * @return self
     */
    public function addSubscriber(EventSubscriberInterface $subscriber)
    {
        $this->dispatcher->addSubscriber($subscriber);
        return $this;
    }

    /**
     * @param Request|null $request
     * @return array
     */
    public function process($request=null)
    {
        $this->event->setArgument('request', $request);
        $this->dispatcher->dispatch(self::EVENT_NAME, $this->event);
        return $this->event->getArguments();
    }
}
