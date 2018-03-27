<?php

namespace AppBundle\Listener;

use AppBundle\Factory\DTOFactoryInterface;
use AppBundle\Entity\User;
use AppBundle\Helper\FormErrorHelper;
use AppBundle\Helper\TableActionHelperInterface;
use AppBundle\Mapper\EntityMapper;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\Form\FormFactoryInterface;
use AppBundle\Mapper\MapperInterface;

/**
 * Class AbstractFormListener
 * @package AppBundle\Listener
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
     * @var EntityMapper
     */
    protected $mapper;

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
     * @param FormErrorHelper $formError
     * @param TableActionHelperInterface $tableHelper
     */
    public function __construct(
        DTOFactoryInterface $dtoFactory,
        FormFactoryInterface $formFactory,
        MapperInterface $mapper,
        FormErrorHelper $formError,
        TableActionHelperInterface $tableHelper = null
    ) {
        $this->dtoFactory  = $dtoFactory;
        $this->formFactory = $formFactory;
        $this->mapper      = $mapper;
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
