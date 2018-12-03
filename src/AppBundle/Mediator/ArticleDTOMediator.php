<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:46
 */

namespace AppBundle\Mediator;


use AppBundle\DTO\ArticleDTO;
use AppBundle\DTO\ResourceDTO;
use AppBundle\Entity\Article;
use AppBundle\Factory\MediatorFactory;
use AppBundle\Form\ArticleDTOType;
use AppBundle\Helper\AssetHelper;
use AppBundle\Helper\DateHelper;
use AppBundle\Manager\File\FileRouter;
use AppBundle\Serializer\HDateNormalizer;
use AppBundle\Utils\HDate;
use AppBundle\Utils\UrlBag;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Psr\Container\ContainerInterface;
use Symfony\Component\Routing\Generator\UrlGenerator;
use Symfony\Component\Routing\Router;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Validator\Constraints\DateTime;

class ArticleDTOMediator extends DTOMediator
{
    const DTO_CLASS_NAME = ArticleDTO::class;
    const ENTITY_CLASS_NAME = Article::class;

    /**
     * ArticleDTOMediator constructor.
     * @param ContainerInterface $locator
     */
    public function __construct(ContainerInterface $locator)
    {
        parent::__construct($locator);
        $this->groups = ['minimal','abstract','date','type','detailImage','subArticles','hteRange'];
        $this->dtoClassName = self::DTO_CLASS_NAME;
        $this->entityClassName = self::ENTITY_CLASS_NAME;
    }

    /**
     * @return array
     */
    public static function getSubscribedServices()
    {
        return [
            HDateNormalizer::class,
            AssetHelper::class,
            MediatorFactory::class,
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
            ->setType($article->getType());
            //->addMappedGroup('minimal');
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
            ->setAbstract($article->getAbstract());
            //->addMappedGroup('abstract');
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
            ->setHasEndDate($hasEndDate);
            //->addMappedGroup('date');
    }

    protected function mapDTODetailImageGroup($mode=DTOMediator::NOTHING_IF_NULL,$subGroups=null)
    {
        $assetHelper = $this->locator->get(AssetHelper::class);
        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        /** @var Article $article */
        $article = $this->entity;

        $detailImage = $article->getDetailImage();
        $detailUrl = null;

        if($detailImage !== null){
            if($dto->getDetailImageResource() === null){
                $resourceMediator = $this->locator->get(MediatorFactory::class)
                    ->create(ResourceDTO::class,$detailImage,null,$mode);
            }
            else{
                $resourceMediator = $dto->getDetailImageResource()->getMediator();
            }
            $resourceMediator->mapDTOGroups($subGroups,$mode);
            $dto->setDetailImageResource($resourceMediator->getDTO());
        }
        else{
            $dto->setDetailImageResource(null);
        }
        //$dto->addMappedGroup('detailImage');
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
        //$dto->addMappedGroup('hteRange');
    }

    protected function mediateBeginHDate($mapperCommands){
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

        return $mapperCommands;
    }

    protected function mediateEndHDate($mapperCommands){
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

        return $mapperCommands;
    }

    protected function mediateHteRange($mapperCommands){
        $hDateNormalizer = $this->locator->get(HDateNormalizer::class);
        $encoder = $this->locator->get('serializer.encoder.json');

        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        /** @var Article $article */
        $article = $this->entity;

        $article->sethteRange($dto->gethteRange()?$encoder->encode(
            $hDateNormalizer->normalize($dto->gethteRange()),'json'):null);
    }

    protected function mediateDetailImageResource($mapperCommands){
        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        /** @var Article $article */
        $article = $this->entity;

        $article->setDetailImage(
            $dto->getDetailImageResource()?
                $dto->getDetailImageResource()->getMediator()->getEntity():null);

        return $mapperCommands;
    }
}