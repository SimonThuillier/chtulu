<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:46
 */

namespace AppBundle\Mediator;


use AppBundle\DTO\ArticleDTO;
use AppBundle\Entity\Article;
use AppBundle\Helper\DateHelper;
use AppBundle\Utils\HDate;

class ArticleDTOMediator extends DTOMediator
{
    /**
     * ArticleDTOMediator constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->groups = ['minimal'=>false,'abstract'=>false,'date'=>false];
    }

    /**
     * @param string $group
     * @throws NotAvailableGroupException
     * @throws NullColleagueException
     * @return self
     */
    public function setDTOGroup(String $group)
    {
        parent::setDTOGroup($group);
        $function = 'setDTO' . ucfirst($group) . 'Group';
        $this->$function();

        return $this;
    }

    private function setDTOMinimalGroup()
    {
        /** @var Article $article */
        $article = $this->entity;
        /** @var ArticleDTO $DTO */
        $DTO = $this->DTO;
        $DTO
            ->setTitle($article->getTitle())
            ->setType($article->getType())
            ->setAbstract($article->getAbstract());
        $this->pendingSetting = false;
        $this->groups['minimal'] = true;
    }

    private function setDTOAbstractGroup()
    {
        /** @var Article $article */
        $article = $this->entity;
        /** @var ArticleDTO $DTO */
        $DTO = $this->DTO;
        $DTO
            ->setAbstract($article->getAbstract());
        $this->pendingSetting = false;
        $this->groups['abstract'] = true;
    }

    private function setDTODateGroup()
    {
        /** @var Article $article */
        $article = $this->entity;
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
            ->setHasEndDate($hasEndDate);
        $this->pendingSetting = false;
        $this->groups['date'] = true;
    }

    protected function mediateBeginHDate(){
        /** @var ArticleDTO $DTO */
        $DTO = $this->DTO;
        /** @var Article $article */
        $article = $this->entity;
        $beginHDate = $DTO->getBeginHDate();

        if($beginHDate !== null){
            $article
                ->setBeginDateType($beginHDate->getType())
                ->setBeginDateMinIndex(DateHelper::dateToIndex($beginHDate->getBeginDate()))
                ->setBeginDateMaxIndex(DateHelper::dateToIndex($beginHDate->getEndDate()))
                ->setBeginDateLabel($beginHDate->getLabel());
        }
        else{
            $article
                ->setBeginDateType(null)
                ->setBeginDateMinIndex(null)
                ->setBeginDateMaxIndex(null)
                ->setBeginDateLabel(null);
        }
    }

    protected function mediateEndHDate(){
        /** @var ArticleDTO $DTO */
        $DTO = $this->DTO;
        /** @var Article $article */
        $article = $this->entity;
        $endHDate = $DTO->getEndHDate();

        if($DTO->getHasEndDate() && $endHDate !== null){
            $article
                ->setEndDateType($endHDate->getType())
                ->setEndDateMinIndex(DateHelper::dateToIndex($endHDate->getBeginDate()))
                ->setEndDateMaxIndex(DateHelper::dateToIndex($endHDate->getEndDate()))
                ->setEndDateLabel($endHDate->getLabel());
        }
        else{
            $article
                ->setBeginDateType(null)
                ->setBeginDateMinIndex(null)
                ->setBeginDateMaxIndex(null)
                ->setBeginDateLabel(null);
        }
    }
}