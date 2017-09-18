<?php

namespace AppBundle\Mapper;

use Symfony\Component\Form\Exception\LogicException;

/**
 * Class ArticleCollectionDoctrineMapper
 *
 * @package AppBundle\Mapper
 */
class ArticleCollectionDoctrineMapper extends AbstractDoctrineMapper
{
    /**
     * @param SiteDTO $dto
     */
    public function add(SiteDTO $dto)
    {

        $site = $this->entityFactory->newInstance($dto);
        $this->getManager()->persist($site);
        $this->getManager()->flush();
    }

    /**
     * @param string $id
     * @param  $dto
     */
    public function edit(string $id, $dto)
    {
        /*
        $site = $this->getRepository()->find($id);
        if (!$site) {
            throw new \LogicException(sprintf('impossible to find information for id %s', $id));
        }
        $site->setLabel($dto->label);
        $site->setNumber($dto->number);
        $site->setAccompaniment($dto->accompaniment);
        $this->getManager()->flush();*/
    }




    /**
     * @param $page
     * @param $maxPage
     * @param null $label
     * @param null $number
     * @param null $accompaniment
     * @return array
     */
    public function findBySearch($page, $maxPage, $label = null, $number = null, $accompaniment = null)
    {
        $paginator = [];
        if ($this->getRepository()->findBySearch($label, $number, $accompaniment) !== null) {
            $query = $this->getRepository()->findBySearch($label, $number, $accompaniment);

            $firstResult = ($page - 1) * $maxPage;
            $query->setFirstResult($firstResult)->setMaxResults($maxPage);
            $paginator = $this->paginatorFactory->newInstance($query);
        }
        return $paginator;
    }

    /**
     * @param $label
     * @return mixed
     */
    public function autocomplete($label)
    {
        $result = $this->getRepository()->autocomplete($label);

        return $result;
    }
}
