<?php

namespace AppBundle\Listener;

use AppBundle\Helper\ArticleHelper;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use AppBundle\Form\SearchArticleType;
use AppBundle\Factory\DTOFactoryInterface;
use Symfony\Component\Form\FormFactoryInterface;
use AppBundle\Helper\FormErrorHelper;
use AppBundle\Helper\TableActionHelperInterface;
use AppBundle\Mapper\ArticleCollectionDoctrineMapper;
use Symfony\Component\HttpFoundation\Request;

class SearchArticleFormListener extends AbstractFormListener
{
    const TABLE_ACTION = [
            'show'   => 'article_edit',
            //'delete' => 'synerail.delete.site',
        ];

    const MAX_PAGE = 15;

    /**
     * @var ArticleHelper
     */
    private $articleHelper;
    private $logger;

    public function __construct(
        DTOFactoryInterface $dtoFactory,
        FormFactoryInterface $formFactory,
        ArticleCollectionDoctrineMapper $mapper,
        FormErrorHelper $formError,
        TableActionHelperInterface $tableHelper = null,
        ArticleHelper $articleHelper,
        LoggerInterface $logger
        ) {
            parent::__construct($dtoFactory, $formFactory, $mapper, $formError,$tableHelper);
            $this->articleHelper = $articleHelper;
        $this->logger = $logger;
    }


    /**
     * @param GenericEvent $event
     */
    public function onProcess(GenericEvent $event)
    {
        /** @var Request $request */
        $request = $event->getArgument('request');

        $page = $request->get('page')>0 ? $request->get('page'):1;

        $articles = $this->mapper->findBySearch($page, self::MAX_PAGE);

        $form = $this->formFactory->create(SearchArticleType::class, $this->dtoFactory->newInstance());

        $form->handleRequest($request);

        $this->logger->info("soumise : " . $form->isSubmitted() . " - valide : " . $form->isValid());
        if ($form->isSubmitted() && $form->isValid()) {

            $data = $form->getData();

            $this->logger->info(json_encode((array)$data));
            $this->articleHelper->deserializeDates($data);
            $this->logger->info($data->getBeginHDate());
            $articles = $this->mapper->findBySearch(
                $page,
                self::MAX_PAGE,
                $data->title,
                $data->type,
                $data->getBeginHDate()
            );
        }
        else{
            $articles = $this->mapper->findBySearch($page, self::MAX_PAGE);
        }

        $tableAction = $this->tableHelper->addTableAction($articles,'article', self::TABLE_ACTION);

        $pagination = [
            'page'        => $page,
            'nbPages'     => ceil(count($articles) / self::MAX_PAGE),
            'nomRoute'    => 'article_list',
            'paramsRoute' => [],
        ];

        $event->setArgument('articles', $articles);
        $event->setArgument('table_action', $tableAction);
        $event->setArgument('form_search', $form->createView());
        $event->setArgument('pagination', $pagination);
    }
}
