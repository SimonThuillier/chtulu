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
use AppBundle\Form\ArticleDTOType;
use AppBundle\Helper\DateHelper;
use AppBundle\Utils\HDate;
use AppBundle\Utils\UrlBag;
use Symfony\Component\Routing\Generator\UrlGenerator;

class ArticleDTOMediator extends DTOMediator
{
    /**
     * ArticleDTOMediator constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->groups = ['minimal','abstract','date','type','url','detailImage','subArticles'];
        $this->formTypeClassName = ArticleDTOType::class;
    }

    /**
     * @param string $group
     * @throws NotAvailableGroupException
     * @throws NullColleagueException
     * @return self
     */
    public function mapDTOGroup(String $group)
    {
        parent::mapDTOGroup($group);
        $function = 'mapDTO' . ucfirst($group) . 'Group';
        $this->$function();

        return $this;
    }

    private function mapDTOMinimalGroup()
    {
        /** @var Article $article */
        $article = $this->entity;
        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        $dto
            ->setId($article->getId())
            ->setTitle($article->getTitle())
            ->setType($article->getType())
            ->addMappedGroup('minimal');
        // ensure mapped children are loaded
        $article->getType()->getLabel();
    }

    private function mapDTOAbstractGroup()
    {
        /** @var Article $article */
        $article = $this->entity;
        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        $dto
            ->setAbstract($article->getAbstract())
            ->addMappedGroup('abstract');
    }

    private function mapDTODateGroup()
    {
        /** @var Article $article */
        $article = $this->entity;
        $beginHDate = ($article->getBeginDateType() !== null)?new HDate():null;
        $endHDate = ($article->getEndDateType() !== null)?new HDate():null;
        $hasEndDate = $article->getId()>0?false:true;

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

        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        $dto
            ->setBeginHDate($beginHDate)
            ->setEndHDate($endHDate)
            ->setHasEndDate($hasEndDate)
            ->addMappedGroup('date');
    }

    private function mapDTOUrlGroup()
    {
        if ($this->dto->getId() <1) return $this->mapDTOUrlGroupForNewEntity();

        /** @var Article $article */
        $article = $this->entity;
        /** @var ArticleDTO $dto */
        $dto = $this->dto;

        $postUrl = $dto->getId()>0?$this->router->generate("article_post_edit",["article"=>$article])
            :$this->router->generate("article_post_create");

        if ($dto->getUrlBag() === null){$dto->setUrlBag(new UrlBag());}
        $dto->getUrlBag()
            ->setView($this->router->generate("article_view",["article"=>$article]))
            ->setEdit($this->router->generate("article_edit",["article"=>$article]))
            ->setPost($this->router->generate("article_post_edit",["article"=>$article]))
            ->setInfo($this->router->generate("article_getdata",["article"=>$article]))
            ->setDelete($this->router->generate("article_delete",["article"=>$article]))
            ->setCancel($this->router->generate("article_cancel",["article"=>$article]));

        $dto->addMappedGroup('url');
    }

    private function mapDTOUrlGroupForNewEntity()
    {
        /** @var ArticleDTO $dto */
        $dto = $this->dto;

        if ($dto->getUrlBag() === null){$dto->setUrlBag(new UrlBag());}
        $dto->getUrlBag()
            ->setPost($this->router->generate("article_post_create"));

        $dto->addMappedGroup('url');
    }

    private function mapDTODetailImageGroup()
    {
        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        // TODO : complete when images management is completed
        $dto->addMappedGroup('detailImage');
    }

    private function mapDTOSubArticlesGroup()
    {
        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        // TODO : complete when sub-article management is completed
        $dto->addMappedGroup('subArticles');
    }

    protected function mediateBeginHDate(){
        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        /** @var Article $article */
        $article = $this->entity;
        $beginHDate = $dto->getBeginHDate();

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
        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        /** @var Article $article */
        $article = $this->entity;
        $endHDate = $dto->getEndHDate();

        if($dto->getHasEndDate() && $endHDate !== null){
            $article
                ->setEndDateType($endHDate->getType())
                ->setEndDateMinIndex(DateHelper::dateToIndex($endHDate->getBeginDate()))
                ->setEndDateMaxIndex(DateHelper::dateToIndex($endHDate->getEndDate()))
                ->setEndDateLabel($endHDate->getLabel());
        }
        else{
            $article
                ->setEndDateType(null)
                ->setEndDateMinIndex(null)
                ->setEndDateMaxIndex(null)
                ->setEndDateLabel(null);
        }
    }
}