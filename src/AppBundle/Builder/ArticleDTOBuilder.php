<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:46
 */

namespace AppBundle\Builder;


use AppBundle\DTO\ArticleDTO;
use AppBundle\Entity\Article;

class ArticleDTOBuilder extends DTOBuilder
{
    /**
     * @param string $part
     * @param ArticleDTO $object
     * @throws NotAvailablePartException
     * @throws NullDTOException
     */
    public function buildPart(String $part, $object)
    {
        parent::buildPart($part, $object);
        $function = 'build' . ucfirst(strtolower($part)) . 'Part';
        $this->$function($object);
    }

    /**
     * @param Article $article
     */
    private function buildMinimalPart($article)
    {
        /** @var ArticleDTO $DTO */
        $DTO = $this->DTO;
        $DTO
            ->setTitle($article->getTitle())
            ->setType($article->getType())
            ->setAbstract($article->getAbstract())
            ->declareActivePart('minimal');
    }

    /**
     * @param Article $article
     */
    private function buildDatePart($article)
    {
        /** @var ArticleDTO $DTO */
        $DTO = $this->DTO;
        $DTO
            ->setBeginHDate($article->getBeginHDate())
            ->setHasEndDate(true)
            ->setEndHDate($article->getBeginHDate())
            ->declareActivePart('date');
    }

}