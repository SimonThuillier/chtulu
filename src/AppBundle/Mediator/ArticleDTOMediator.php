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
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Routing\Generator\UrlGenerator;
use Symfony\Component\Routing\Router;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Validator\Constraints\DateTime;

class ArticleDTOMediator extends DTOMediator
{

    /**
     * ArticleDTOMediator constructor.
     * @param ContainerInterface $locator
     */
    public function __construct(ContainerInterface $locator)
    {
        parent::__construct($locator);
        $this->groups = ['minimal','abstract','date','type','url',
            'detailImage','subArticles','hteRange'];
        $this->entityClassName = Article::class;
        $this->dtoClassName = ArticleDTO::class;
    }

    /**
     * @return array
     */
    public static function getSubscribedServices()
    {
        return [
            HDateNormalizer::class,
            AssetHelper::class,
            'serializer.encoder.json' => JsonEncoder::class,
            'router' => Router::class,
            'doctrine' => ManagerRegistry::class
        ];
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

        $router = $this->locator->get('router');

        $postUrl = $dto->getId()>0?$router->generate("article_post_edit",["article"=>$article])
            :$router->generate("article_post_create");

        if ($dto->getUrlBag() === null){$dto->setUrlBag(new UrlBag());}
        $dto->getUrlBag()
            ->setView($router->generate("article_view",["article"=>$article]))
            ->setEdit($router->generate("article_edit",["article"=>$article]))
            ->setPost($postUrl)
            ->setInfo($router->generate("article_getdata",["article"=>$article]))
            ->setDelete($router->generate("article_delete",["article"=>$article]))
            ->setCancel($router->generate("article_cancel",["article"=>$article]));

        $dto->addMappedGroup('url');
    }

    protected function mapDTOUrlGroupForNewEntity()
    {
        $router = $this->locator->get('router');
        /** @var ArticleDTO $dto */
        $dto = $this->dto;

        if ($dto->getUrlBag() === null){$dto->setUrlBag(new UrlBag());}
        $dto->getUrlBag()
            ->setPost($router->generate("article_post_create"));

        $dto->addMappedGroup('url');
    }

    protected function mapDTODetailImageGroup()
    {
        $assetHelper = $this->locator->get(AssetHelper::class);
        /** @var ArticleDTO $dto */
        $dto = $this->dto;

        $dto->setDetailImageUrl($assetHelper->getDefaultImage($this->entity));

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
        $hDateNormalizer = $this->locator->get(HDateNormalizer::class);
        $encoder = $this->locator->get('serializer.encoder.json');


        /** @var Article $article */
        $article = $this->entity;
        /** @var ArticleDTO $dto */
        $dto = $this->dto;

        if($article->gethteRange() !==null){
            $dto->sethteRange($hDateNormalizer->denormalize(
                $encoder->decode($article->gethteRange(),'json'),HDate::class));
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
        $hDateNormalizer = $this->locator->get(HDateNormalizer::class);
        $encoder = $this->locator->get('serializer.encoder.json');

        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        /** @var Article $article */
        $article = $this->entity;

        $article->sethteRange($dto->gethteRange()?$encoder->encode(
            $hDateNormalizer->normalize($dto->gethteRange()),'json'):null);
    }
}