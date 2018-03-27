<?php

namespace AppBundle\Helper;

use Symfony\Component\Routing\Router;

/**
 * Class TableActionHelper
 * @package AppBundle\Helper
 */
class TableActionHelper
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
     * @param string $idName
     * @param array $element
     * @return array
     */
    public function addTableAction($table,$idName, array $element):array
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
                $action[] = $this->$methodAction($element,$idName, $id);
            }

            $action[]          = '</div>';
            $tableAction[$key] = implode($action);
        }
        return $tableAction;
    }

    public function deleteAction($element,$idName, $id)
    {
        $explodeElement = explode('_', $element['delete']);
        $deleteUrl      = $this->router->generate(
            $element['delete'],
            [$idName => $id]
        );

        return '<button type="button" class="btn btn-delete btn-delete-' . $explodeElement[0] .
               ' btn-danger btn-xs" title="supprimer"' .
               'data-url="' . $deleteUrl . '">' .
               '<i class="fa fa-trash-o fa-lg"></i>' .
               '</button>';
    }

    public function editAction($element,$idName,  $id)
    {
        $explodeElement = explode('_', $element['edit']);
        $editUrl        = $this->router->generate(
            $element['edit'],
            [$idName => $id]
        );

        return '<button type="button" class="btn-edit-' . $explodeElement[0] .
               ' btn btn-secondary btn-xs" title="Editer"' .
               'data-url="' . $editUrl . '" data-id="' . $id . '">' .
               '<i class="fa fa-pencil fa-lg"></i>' .
               '</button>';
    }

    public function showAction($element,$idName,  $id)
    {
        $explodeElement = explode('_', $element['show']);
        $showUrl        = $this->router->generate(
            $element['show'],
            [$idName => $id]
        );

        return '<a class="btn-show-' . $explodeElement[0] .
               ' btn btn-secondary btn-xs" href="' . $showUrl . '">' .
               '<i class="fa fa-eye fa-lg"></i>' .
               '</a>';
    }

    public function infoAction($element,$idName,  $id)
    {
        $explodeElement = explode('_', $element['info']);
        $infoUrl        = $this->router->generate(
            $element['info'],
            [$idName => $id]
        );

        return '<button type="button" class="btn btn-info-' . $explodeElement[0] .
               ' btn-secondary btn-xs" title="information"' .
               'data-url="' . $infoUrl . '">' .
               '<i class="fa fa-info-circle fa-lg"></i>' .
               '</button>';
    }

    public function downloadAction($element,$idName,  $id)
    {
        $explodeElement = explode('_', $element['download']);
        $showUrl        = $this->router->generate(
            $element['download'],
            [$idName => $id]
        );

        return '<a class="btn-download-' . $explodeElement[0] .
               ' btn btn-info btn-xs" href="' . $showUrl . '">' .
               '<i class="fa fa-download fa-lg"></i>' .
               '</a>';
    }
}
