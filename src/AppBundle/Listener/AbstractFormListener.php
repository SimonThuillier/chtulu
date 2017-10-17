<?php

namespace AppBundle\EventListener;

use AppBundle\Factory\DTOFactoryInterface;
use AppBundle\Entity\User;
use AppBundle\Helper\FormErrorHelper;
use AppBundle\Helper\TableActionHelperInterface;
use AppBundle\Mapper\AbstractDoctrineMapper;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Mapper\MapperInterface;

/**
 * Class AbstractFormListener
 * @package Synerail\AppBundle\EventListener
 */
abstract class AbstractFormListener implements EventSubscriberInterface, ListenerInterface
{
    /**
     * @var DTOFactoryInterface
     */
    protected $dtoFactory;
    /**
     * @var FormFactoryInterface
     */
    protected $formFactory;
    /**
     * @var AbstractDoctrineMapper
     */
    protected $mapper;
    /**
     * @var Request
     */
    protected $request;

    /**
     * @var FormErrorHelper
     */
    protected $formError;

    /**
     * @var TableActionHelperInterface
     */
    protected $tableHelper;

    /**
     * @var User
     */
    protected $user;

    const SUBSCRIBED_EVENTS = ['process' => 'onProcess'];

    /**
     * SearchUserFormListener constructor.
     *
     * @param DTOFactoryInterface $dtoFactory
     * @param FormFactoryInterface $formFactory
     * @param MapperInterface $mapper
     * @param Request $request
     * @param FormErrorHelper $formError
     * @param TableActionHelperInterface $tableHelper
     */
    public function __construct(
        DTOFactoryInterface $dtoFactory,
        FormFactoryInterface $formFactory,
        MapperInterface $mapper,
        Request $request,
        FormErrorHelper $formError,
        TableActionHelperInterface $tableHelper = null
    ) {
        $this->dtoFactory  = $dtoFactory;
        $this->formFactory = $formFactory;
        $this->mapper      = $mapper;
        $this->request     = $request;
        $this->formError   = $formError;
        $this->tableHelper = $tableHelper;
    }

    /**
     * @return mixed
     */
    public static function getSubscribedEvents()
    {
        return self::SUBSCRIBED_EVENTS;
    }

    /**
     * @param GenericEvent $event
     * @return mixed
     */
    abstract public function onProcess(GenericEvent $event);
}
