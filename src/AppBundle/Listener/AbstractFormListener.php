<?php

namespace AppBundle\Listener;

use AppBundle\Entity\User;
use AppBundle\Factory\DTOFactory;
use AppBundle\Helper\FormErrorHelper;
use AppBundle\Helper\TableActionHelper;
use AppBundle\Mapper\AbstractEntityMapper;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\Form\FormFactoryInterface;
use AppBundle\Mapper\EntityMapper;

/**
 * Class AbstractFormListener
 * @package AppBundle\Listener
 */
abstract class AbstractFormListener implements EventSubscriberInterface, ListenerInterface
{
    /**
     * @var DTOFactory
     */
    protected $dtoFactory;
    /**
     * @var FormFactoryInterface
     */
    protected $formFactory;
    /**
     * @var AbstractEntityMapper
     */
    protected $mapper;

    /**
     * @var FormErrorHelper
     */
    protected $formError;

    /**
     * @var TableActionHelper
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
     * @param DTOFactory $dtoFactory
     * @param FormFactoryInterface $formFactory
     * @param EntityMapper $mapper
     * @param FormErrorHelper $formError
     * @param TableActionHelper $tableHelper
     */
    public function __construct(
        DTOFactory $dtoFactory,
        FormFactoryInterface $formFactory,
        EntityMapper $mapper,
        FormErrorHelper $formError,
        TableActionHelper $tableHelper = null
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
