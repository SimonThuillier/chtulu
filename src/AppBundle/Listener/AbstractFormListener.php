<?php
//
//namespace AppBundle\Listener;
//
//use AppBundle\Entity\User;
//use AppBundle\Factory\AbstractDTOFactory;
//use AppBundle\Helper\FormErrorHelper;
//use AppBundle\Helper\TableActionHelper;
//use AppBundle\Mapper\AbstractEntityMapper;
//use AppBundle\Mediator\DTOMediator;
//use Symfony\Component\EventDispatcher\EventSubscriberInterface;
//use Symfony\Component\EventDispatcher\GenericEvent;
//use Symfony\Component\Form\FormFactoryInterface;
//use AppBundle\Mapper\EntityMapper;
//
///**
// * Class AbstractFormListener
// * @package AppBundle\Listener
// */
//abstract class AbstractFormListener implements EventSubscriberInterface, ListenerInterface
//{
//    /**
//     * @var AbstractDTOFactory
//     */
//    protected $dtoFactory;
//    /**
//     * @var FormFactoryInterface
//     */
//    protected $formFactory;
//    /**
//     * @var AbstractEntityMapper
//     */
//    protected $mapper;
//
//    /**
//     * @var DTOMediator
//     */
//    protected $mediator;
//
//    /**
//     * @var FormErrorHelper
//     */
//    protected $formError;
//
//    /**
//     * @var TableActionHelper
//     */
//    protected $tableHelper;
//
//    /**
//     * @var User
//     */
//    protected $user;
//
//    const SUBSCRIBED_EVENTS = ['process' => 'onProcess'];
//
//    /**
//     * SearchUserFormListener constructor.
//     *
//     * @param AbstractDTOFactory $dtoFactory
//     * @param FormFactoryInterface $formFactory
//     * @param EntityMapper $mapper
//     * @param FormErrorHelper $formError
//     * @param DTOMediator $mediator
//     * @param TableActionHelper $tableHelper
//     */
//    public function __construct(
//        AbstractDTOFactory $dtoFactory,
//        FormFactoryInterface $formFactory,
//        EntityMapper $mapper,
//        FormErrorHelper $formError,
//        DTOMediator $mediator,
//        TableActionHelper $tableHelper = null
//    ) {
//        $this->dtoFactory  = $dtoFactory;
//        $this->formFactory = $formFactory;
//        $this->mapper      = $mapper;
//        $this->formError   = $formError;
//        $this->tableHelper = $tableHelper;
//        $this->mediator = $mediator;
//    }
//
//    /**
//     * @return mixed
//     */
//    public static function getSubscribedEvents()
//    {
//        return self::SUBSCRIBED_EVENTS;
//    }
//
//    /**
//     * @param GenericEvent $event
//     * @return mixed
//     */
//    abstract public function onProcess(GenericEvent $event);
//}
