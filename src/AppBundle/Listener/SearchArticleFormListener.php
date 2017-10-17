<?php

namespace AppBundle\EventListener;

use Symfony\Component\EventDispatcher\GenericEvent;
use AppBundle\Form\SearchArticleType;

class SearchArticleFormListener extends AbstractFormListener
{
    const TABLE_ACTION = [
            'show'   => 'synerail.dashboard.site',
            'delete' => 'synerail.delete.site',
        ];

    const MAX_PAGE = 15;

    /**
     * @param GenericEvent $event
     */
    public function onProcess(GenericEvent $event)
    {
        $page = $this->request->get('page');
        $site = $this->mapper->findBySearch($page, self::MAX_PAGE);

        $form = $this->formFactory->create(SearchArticleType::class, $this->dtoFactory->newInstance());

        $form->handleRequest($this->request);

        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();

            $site = $this->mapper->findBySearch(
                $page,
                self::MAX_PAGE,
                $data->label,
                $data->number,
                $data->accompaniment
            );
        }

        $tableAction = $this->tableHelper->addTableAction($site, self::TABLE_ACTION);


        $pagination = [
            'page'        => $page,
            'nbPages'     => ceil(count($site) / self::MAX_PAGE),
            'nomRoute'    => 'synerail.home.site',
            'paramsRoute' => [],
        ];

        $event->setArgument('sites', $site);
        $event->setArgument('table_action', $tableAction);
        $event->setArgument('form_search', $form->createView());
        $event->setArgument('pagination', $pagination);
    }
}
