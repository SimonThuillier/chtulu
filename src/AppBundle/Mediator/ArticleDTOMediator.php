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
use AppBundle\Helper\AssetHelper;
use AppBundle\Helper\DateHelper;
use AppBundle\Serializer\HDateNormalizer;
use AppBundle\Utils\HDate;
use AppBundle\Utils\UrlBag;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Routing\Generator\UrlGenerator;
use Symfony\Component\Validator\Constraints\DateTime;

class ArticleDTOMediator extends DTOMediator
{
    /** @var HDateNormalizer */
    private $hDateSerializer;
    /** @var AssetHelper */
    private $assetHelper;

    /**
     * ArticleDTOMediator constructor.
     * @param HDateNormalizer $hDateSerializer
     * @param AssetHelper $assetHelper
     */
    public function __construct(HDateNormalizer $hDateSerializer, AssetHelper $assetHelper)
    {
        parent::__construct();
        $this->groups = ['minimal','abstract','date','type','url',
            'detailImage','subArticles','hteRange'];
        $this->hDateSerializer = $hDateSerializer;
        $this->assetHelper = $assetHelper;
    }

    protected function mapDTOMinimalGroup()
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

    protected function mapDTOAbstractGroup()
    {
        /** @var Article $article */
        $article = $this->entity;
        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        $dto
            ->setAbstract($article->getAbstract())
            ->addMappedGroup('abstract');
    }

    /**
     * @param Article $article
     * @return null|HDate
     */
    protected function getArticleBeginHDate($article){
        $beginHDate = ($article->getBeginDateType() !== null)?new HDate():null;

        if($beginHDate !== null){
            $beginHDate
                ->setType($article->getBeginDateType())
                ->setBeginDate(DateHelper::indexToDate($article->getBeginDateMinIndex()))
                ->setEndDate(DateHelper::indexToDate($article->getBeginDateMaxIndex()));
        }
        return $beginHDate;
    }

    /**
     * @param Article $article
     * @return null|HDate
     */
    private function getArticleEndHDate($article){
        $endHDate = ($article->getEndDateType() !== null)?new HDate():null;

        if($endHDate !== null){
            $endHDate
                ->setType($article->getEndDateType())
                ->setBeginDate(DateHelper::indexToDate($article->getEndDateMinIndex()))
                ->setEndDate(DateHelper::indexToDate($article->getEndDateMaxIndex()));
        }
        return $endHDate;
    }

    protected function mapDTODateGroup()
    {
        /** @var Article $article */
        $article = $this->entity;
        $hasEndDate = $article->getId()>0?false:true;

        $beginHDate = $this->getArticleBeginHDate($article);
        $endHDate = $this->getArticleEndHDate($article);
        if($endHDate !== null) $hasEndDate = true;

        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        $dto
            ->setBeginHDate($beginHDate)
            ->setEndHDate($endHDate)
            ->setHasEndDate($hasEndDate)
            ->addMappedGroup('date');
    }

    protected function mapDTOUrlGroup()
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

    protected function mapDTOUrlGroupForNewEntity()
    {
        /** @var ArticleDTO $dto */
        $dto = $this->dto;

        if ($dto->getUrlBag() === null){$dto->setUrlBag(new UrlBag());}
        $dto->getUrlBag()
            ->setPost($this->router->generate("article_post_create"));

        $dto->addMappedGroup('url');
    }

    protected function mapDTODetailImageGroup()
    {
        /** @var ArticleDTO $dto */
        $dto = $this->dto;

        $dto->setDetailImage($this->assetHelper->getMainImage($this->entity));

        $dto->addMappedGroup('detailImage');
    }

    protected function mapDTOSubArticlesGroup()
    {
        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        // TODO : complete when sub-article management is completed
        $dto->addMappedGroup('subArticles');
    }

    protected function mapDTOhteRangeGroup()
    {
        /** @var Article $article */
        $article = $this->entity;
        /** @var ArticleDTO $dto */
        $dto = $this->dto;

        if($article->gethteRange() !==null){
            $dto->sethteRange($this->hDateSerializer->deserialize($article->gethteRange(),null,'json'));
        }
        else{
            $beginHDate = $this->getArticleBeginHDate($article);
            $endHDate = $this->getArticleEndHDate($article);
            $hteRange = $dto->gethteRange();
            if($beginHDate !== null) $hteRange->setBeginDate($beginHDate->getBeginDate());
            if($endHDate !== null) $hteRange->setEndDate($endHDate->getEndDate());
        }
        // TODO : complete when sub-article management is completed
        $dto->addMappedGroup('hteRange');
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

    protected function mediateHteRange(){
        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        /** @var Article $article */
        $article = $this->entity;

        $article->sethteRange($dto->gethteRange()?$this->hDateSerializer->serialize($dto->gethteRange(),'json'):null);
    }
}