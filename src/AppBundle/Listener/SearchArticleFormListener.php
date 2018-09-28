<?php
//
//namespace AppBundle\Listener;
//
//use AppBundle\Factory\ArticleDTOFactory;
//use AppBundle\Helper\ArticleHelper;
//use AppBundle\Helper\TableActionHelper;
//use AppBundle\Mapper\ArticleMapper;
//use AppBundle\Mediator\ArticleDTOMediator;
//use Psr\Log\LoggerInterface;
//use Symfony\Component\EventDispatcher\GenericEvent;
//use AppBundle\Form\ArticleSearchType;
//use Symfony\Component\Form\FormFactoryInterface;
//use AppBundle\Helper\FormErrorHelper;
//use Symfony\Component\HttpFoundation\Request;
//
//class SearchArticleFormListener extends AbstractFormListener
//{
//    const TABLE_ACTION = [
//            'show'   => 'article_edit',
//            //'delete' => 'synerail.delete.site',
//        ];
//
//    const MAX_PAGE = 15;
//
//    /**
//     * @var ArticleHelper
//     */
//    private $articleHelper;
//    private $logger;
//
//    public function __construct(
//        ArticleDTOFactory $dtoFactory,
//        FormFactoryInterface $formFactory,
//        ArticleMapper $mapper,
//        FormErrorHelper $formError,
//        TableActionHelper $tableHelper = null,
//        ArticleDTOMediator $mediator,
//        ArticleHelper $articleHelper,
//        LoggerInterface $logger
//        ) {
//            parent::__construct($dtoFactory, $formFactory, $mapper, $formError,$mediator,$tableHelper);
//            $this->articleHelper = $articleHelper;
//        $this->logger = $logger;
//    }
//
//
//    /**
//     * @param GenericEvent $event
//     */
//    public function onProcess(GenericEvent $event)
//    {
//        /** @var Request $request */
//        $request = $event->getArgument('request');
//
//        $page = $request->get('page')>0 ? $request->get('page'):1;
//
//        $articles = $this->mapper->findAll();
//
//        $form = $this->formFactory->create(ArticleSearchType::class, $this->dtoFactory->create(null));
//
//        $form->handleRequest($request);
//
//        $this->logger->info("soumise : " . $form->isSubmitted() . " - valide : " . $form->isValid());
//        if ($form->isSubmitted() && $form->isValid()) {
//
//            $data = $form->getData();
//
//
//            $this->articleHelper->deserializeDates($data);
//            $this->logger->info(json_encode((array)$data));
//            $this->logger->info($data->getBeginHDate());
//            $this->logger->info($data->getEndHDate());
//            /* = $this->mapper->findBySearch(
//                $page,
//                self::MAX_PAGE,
//                $data->title,
//                $data->type,
//                $data->getBeginHDate(),
//                $data->getEndHDate()
//            );*/
//            $articles = $this->mapper->findAll();
//            // to return form with good label
//            //$data->setBeginDateLabel($data->getBeginHDate()!==null?$data->getBeginHDate()->getLabel():null);
//            //$data->setEndDateLabel($data->getEndHDate()!==null?$data->getEndHDate()->getLabel():null);
//            $form = $this->formFactory->create(ArticleSearchType::class)->setData($data);
//        }
//        else{
//            $articles = $this->mapper->findAll();
//            //$articles = $this->mapper->findBySearch($page, self::MAX_PAGE);
//        }
//
//        $tableAction = $this->tableHelper->addTableAction($articles,'article', self::TABLE_ACTION);
//
//        $pagination = [
//            'page'        => $page,
//            'nbPages'     => ceil(count($articles) / self::MAX_PAGE),
//            'nomRoute'    => 'article_list',
//            'paramsRoute' => [],
//        ];
//
//        $dtos = [];
//        foreach ($articles as $article){
//            $dtos[] = $dto = $this->dtoFactory->create(null);
//            $this->mediator
//                ->setEntity($article)
//                ->setDTO($dto)
//                ->mapDTOGroups(['minimal','date']);
//        }
//
//
//        $event->setArgument('articles', $dtos);
//        $event->setArgument('table_action', $tableAction);
//        $event->setArgument('form_search', $form->createView());
//        $event->setArgument('pagination', $pagination);
//    }
//}
