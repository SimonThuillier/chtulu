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
use AppBundle\Helper\DateHelper;
use AppBundle\Utils\HDate;

class ArticleDTOBuilder extends DTOBuilder
{
    /**
     * @param string $part
     * @param mixed $fromObject
     * @throws NotAvailablePartException
     * @throws NullDTOException
     * @return self
     */
    public function buildPart(String $part, $fromObject)
    {
        parent::buildPart($part, $fromObject);
        $function = 'build' . ucfirst(strtolower($part)) . 'Part';
        $this->$function($fromObject);
        return $this;
    }

    /**
     * @param string $part
     * @param mixed $toObject
     * @throws NotAvailablePartException
     * @throws NullDTOException
     * @return self
     */
    public function returnPart(String $part, $toObject)
    {
        parent::returnPart($part, $toObject);
        $function = 'return' . ucfirst(strtolower($part)) . 'Part';
        $this->$function($toObject);
        return $this;
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
    private function returnMinimalPart($article)
    {
        /** @var ArticleDTO $DTO */
        $DTO = $this->DTO;
        $article
            ->setTitle($DTO->getTitle())
            ->setType($DTO->getType())
            ->setAbstract($DTO->getAbstract());
    }

    /**
     * @param Article $article
     */
    private function buildDatePart($article)
    {
        $beginHDate = ($article->getBeginDateType() !== null)?new HDate():null;
        $endHDate = ($article->getEndDateType() !== null)?new HDate():null;
        $hasEndDate = false;

        if($beginHDate !== null){
            $beginHDate
                ->setType($article->getBeginDateType())
                ->setBeginDate(DateHelper::indexToDate($article->getBeginDateMinIndex()))
                ->setEndDate(DateHelper::indexToDate($article->getBeginDateMaxIndex()));
        }
        if($endHDate !== null){
            $endHDate
                ->setType($article->getEndDateType())
                ->setBeginDate(DateHelper::indexToDate($article->getEndDateMinIndex()))
                ->setEndDate(DateHelper::indexToDate($article->getEndDateMaxIndex()));
            $hasEndDate = true;
        }

        /** @var ArticleDTO $DTO */
        $DTO = $this->DTO;
        $DTO
            ->setBeginHDate($beginHDate)
            ->setEndHDate($endHDate)
            ->setHasEndDate($hasEndDate)
            ->declareActivePart('date');
    }

    /**
     * @param Article $article
     */
    private function returnDatePart($article)
    {
        /** @var ArticleDTO $DTO */
        $DTO = $this->DTO;

        $beginHDate = $DTO->getBeginHDate();
        $endHDate = $DTO->getEndHDate();

        if($DTO->getBeginHDate() !== null){
            $article
                ->setBeginDateType($beginHDate->getType())
                ->setBeginDateMinIndex(DateHelper::dateToIndex($beginHDate->getBeginDate()))
                ->setBeginDateMaxIndex(DateHelper::dateToIndex($beginHDate->getEndDate()))
                ->setBeginDateLabel($beginHDate->getLabel());
        }
        if($DTO->getHasEndDate()){
            $article
                ->setEndDateType($endHDate->getType())
                ->setEndDateMinIndex(DateHelper::dateToIndex($endHDate->getBeginDate()))
                ->setEndDateMaxIndex(DateHelper::dateToIndex($endHDate->getEndDate()))
                ->setEndDateLabel($endHDate->getLabel());
        }
    }

}