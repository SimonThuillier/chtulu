<?php

namespace AppBundle\Helper;

use Symfony\Component\Routing\Router;

/**
 * Class TableActionHelper
 * @package AppBundle\Helper
 */
class TableActionHelper implements TableActionHelperInterface
{
    /**
     * @var Router
     */
    protected $router;

    /**
     * TableActionHelper constructor.
     *
     * @param Router $router
     */
    public function __construct(Router $router)
    {
        $this->router = $router;
    }

    /**
     * @param array $table
     * @param array $element
     * @return array
     */
    public function addTableAction($table, array $element):array
    {
        $tableAction = [];
        foreach ($table as $key => $value) {
            $id = '';
            if (is_object($value)) {
                $id = $value->getId();
            }

            if (is_array($value)) {
                $id = $value['id'];
            }
            $action   = [];
            $action[] = '<div class="btn-group btn-group-sm" role="group">';


            foreach (array_keys($element) as $event) {
                if (array_key_exists('info', $element)) {
                    if ($value['id_document']) {
                        $id = $value['id_document'];
                    }
                }

                $methodAction = $event.'Action';
                $action[] = $this->$methodAction($element, $id);
            }

            $action[]          = '</div>';
            $tableAction[$key] = implode($action);
        }
        return $tableAction;
    }

    public function deleteAction($element, $id)
    {
        $explodeElement = explode('.', $element['delete']);
        $deleteUrl      = $this->router->generate(
            $element['delete'],
            ['id' => $id]
        );

        return '<button type="button" class="btn btn-delete btn-delete-' . $explodeElement[2] .
               ' btn-danger btn-xs" title="supprimer"' .
               'data-url="' . $deleteUrl . '">' .
               '<i class="fa fa-trash-o fa-lg"></i>' .
               '</button>';
    }

    public function editAction($element, $id)
    {
        $explodeElement = explode('.', $element['edit']);
        $editUrl        = $this->router->generate(
            $element['edit'],
            ['id' => $id]
        );

        return '<button type="button" class="btn-edit-' . $explodeElement[2] .
               ' btn btn-secondary btn-xs" title="Editer"' .
               'data-url="' . $editUrl . '" data-id="' . $id . '">' .
               '<i class="fa fa-pencil fa-lg"></i>' .
               '</button>';
    }

    public function showAction($element, $id)
    {
        $explodeElement = explode('.', $element['show']);
        $showUrl        = $this->router->generate(
            $element['show'],
            ['id' => $id]
        );

        return '<a class="btn-show-' . $explodeElement[2] .
               ' btn btn-secondary btn-xs" href="' . $showUrl . '">' .
               '<i class="fa fa-eye fa-lg"></i>' .
               '</a>';
    }

    public function infoAction($element, $id)
    {
        $explodeElement = explode('.', $element['info']);
        $infoUrl        = $this->router->generate(
            $element['info'],
            ['id' => $id]
        );

        return '<button type="button" class="btn btn-info-' . $explodeElement[2] .
               ' btn-secondary btn-xs" title="information"' .
               'data-url="' . $infoUrl . '">' .
               '<i class="fa fa-info-circle fa-lg"></i>' .
               '</button>';
    }

    public function downloadAction($element, $id)
    {
        $explodeElement = explode('.', $element['download']);
        $showUrl        = $this->router->generate(
            $element['download'],
            ['id' => $id]
        );

        return '<a class="btn-download-' . $explodeElement[2] .
               ' btn btn-info btn-xs" href="' . $showUrl . '">' .
               '<i class="fa fa-download fa-lg"></i>' .
               '</a>';
    }
}
