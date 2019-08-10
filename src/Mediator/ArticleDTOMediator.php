<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:46
 */

namespace App\Mediator;


use App\DTO\ArticleDTO;
use App\DTO\ResourceDTO;
use App\DTO\ResourceGeometryDTO;
use App\Entity\Article;
use App\Entity\HResource;
use App\Entity\ResourceGeometry;
use App\Factory\MediatorFactory;
use App\Helper\AssetHelper;
use App\Helper\DateHelper;
use App\Observer\DBActionObserver;
use App\Serializer\HDateNormalizer;
use App\Util\Command\EntityMapperCommand;
use App\Util\Command\LinkCommand;
use App\Util\HDate;
use Doctrine\Common\Persistence\ManagerRegistry;
use Psr\Container\ContainerInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Serializer\Encoder\EncoderInterface;

class ArticleDTOMediator extends DTOMediator
{
    const DTO_CLASS_NAME = ArticleDTO::class;
    const ENTITY_CLASS_NAME = Article::class;

    /**
     * ArticleDTOMediator constructor.
     * @param ContainerInterface $locator
     * @param DBActionObserver $dbActionObserver
     */
    public function __construct(ContainerInterface $locator, DBActionObserver $dbActionObserver)
    {
        parent::__construct($locator,$dbActionObserver);
        $this->dtoClassName = self::DTO_CLASS_NAME;
        $this->entityClassName = self::ENTITY_CLASS_NAME;
        $this->groups = ['minimal','abstract','date','type','detailImage','geometry'];
        //'subArticles','hteRange'
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
            'serializer.encoder.json' => EncoderInterface::class,
            'router' => RouterInterface::class,
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
    protected function getArticleBeginHDate($article)
    {
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
    private function getArticleEndHDate($article)
    {
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

    protected function mapDTOGeometryGroup($mode=DTOMediator::NOTHING_IF_NULL,$subGroups=null)
    {
        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        /** @var Article $article */
        $article = $this->entity;

        $geometry = $article->getGeometry();

        if($geometry !== null){
            $geometryMediator = $this->locator->get(MediatorFactory::class)
                ->create(ResourceGeometryDTO::class,$geometry->getId(),$geometry,null,$mode);
            $geometryMediator->mapDTOGroups($subGroups,$mode);
            $dto->setGeometry($geometryMediator->getDTO());
        }
        else{
            $dto->setGeometry(null);
        }
        //$dto->addMappedGroup('detailImage');
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
                    ->create(ResourceDTO::class,$detailImage->getId(),$detailImage,null,$mode);
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

    protected function mediateBeginHDate()
    {
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

        return true;
    }

    protected function mediateEndHDate()
    {
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

        return true;
    }

    protected function mediateDetailImageResource()
    {
        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        /** @var Article $article */
        $article = $this->entity;

        if($dto->getDetailImageResource() !== null){
            $command = new LinkCommand(
                EntityMapperCommand::ACTION_LINK,
                $this->getEntityClassName(),
                $dto->getId(),
                $article
            );
            $command->defineLink(
                HResource::class,
                $dto->getDetailImageResource()->getId(),
                'setDetailImage',
                false)
                ->setEntityToLink($dto->getDetailImageResource()->getMediator()->getEntity());
            ;
            $this->dbActionObserver->registerAction($command);
        }
        else{
            $article->setDetailImage(null);
        }
        return true;
    }

    protected function mediateGeometry()
    {
        /** @var ArticleDTO $dto */
        $dto = $this->dto;
        $dto->addBackGroups(['geometry'=>['minimal'=>true]]);
        /** @var Article $article */
        $article = $this->entity;

        if($dto->getGeometry()!==null){
            $dto->getGeometry()->getMediator()->returnDataToEntity();

            $command = new LinkCommand(
                EntityMapperCommand::ACTION_LINK,
                $this->getEntityClassName(),
                $dto->getId(),
                $article
            );
            $command->defineLink(
                ResourceGeometry::class,
                $dto->getGeometry()->getId(),
                'setGeometry',
                false)
                ->setEntityToLink($dto->getGeometry()->getMediator()->getEntity());
            ;
            $this->dbActionObserver->registerAction($command);
        }
        else{
            $article->setGeometry(null);
        }
        return true;
    }
}