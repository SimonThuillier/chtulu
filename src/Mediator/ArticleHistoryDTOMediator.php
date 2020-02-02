<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:46
 */

namespace App\Mediator;


use App\DTO\ArticleDTO;
use App\DTO\ArticleHistoryDTO;
use App\Entity\Article;
use App\Entity\ArticleHistory;
use App\Factory\MediatorFactory;
use App\Observer\DBActionObserver;
use App\Util\AuthorizationBag;
use App\Util\Command\EntityMapperCommand;
use App\Util\Command\LinkCommand;
use Doctrine\Common\Persistence\ManagerRegistry;
use Psr\Container\ContainerInterface;

class ArticleHistoryDTOMediator extends DTOMediator
{
    const DTO_CLASS_NAME = ArticleHistoryDTO::class;
    const ENTITY_CLASS_NAME = ArticleHistory::class;

    /**
     * ArticleHistoryDTOMediator constructor.
     * @param ContainerInterface $locator
     * @param DBActionObserver $dbActionObserver
     */
    public function __construct(ContainerInterface $locator, DBActionObserver $dbActionObserver,$user)
    {
        parent::__construct($locator,$dbActionObserver,$user);
        $this->dtoClassName = self::DTO_CLASS_NAME;
        $this->entityClassName = self::ENTITY_CLASS_NAME;
        $this->groups = ['minimal','article'];
    }

    /**
     * @return array
     */
    public static function getSubscribedServices()
    {
        return [
            MediatorFactory::class,
            'doctrine' => ManagerRegistry::class
        ];
    }

    protected function setAuthorizationBag(){
        $this->authorizationBag = new AuthorizationBag();
        $this->authorizationBag
            ->setRight(AuthorizationBag::READ,true,'a definir ...')
            ->setRight(AuthorizationBag::EDIT,true,'a definir ...')
            ->setRight(AuthorizationBag::ADMIN,true,'a definir ...');
    }

    protected function mapDTOMinimalGroup()
    {
        /** @var ArticleHistory $articleHistory */
        $articleHistory = $this->entity;
        /** @var ArticleHistoryDTO $dto */
        $dto = $this->dto;
        $dto->setId($articleHistory->getId());
        $dto
            ->setActive($articleHistory->getActive())
            ->setMessage($articleHistory->getMessage())
            ->setEditionDate($articleHistory->getEditionDate())
            ->setStatus($articleHistory->getStatus())
            ->setArticleId($articleHistory->getArticle()?$articleHistory->getArticle()->getId():null);
    }

    protected function mapDTOArticleGroup($mode=DTOMediator::NOTHING_IF_NULL,$subGroups=null)
    {
        /** @var ArticleHistory $articleHistory */
        $articleHistory = $this->entity;
        /** @var ArticleHistoryDTO $dto */
        $dto = $this->dto;


        $article = $articleHistory->getArticle();
        if($article === null) return;

        $articleMediator = $this->locator->get(MediatorFactory::class)
            ->create(ArticleDTO::class,$article->getId(),$article,null,$mode);
        $articleMediator->mapDTOGroups($subGroups,$mode);
        $dto->setArticle($articleMediator->getDTO());
    }

    protected function mediateArticleId(){
        /** @var ArticleHistoryDTO $dto */
        $dto = $this->dto;
        /** @var ArticleHistory $articleHistory */
        $articleHistory = $this->entity;
        /** @var Article $article */
        $article = null;

        if($dto->getArticleId() === null) return true;

        $command = new LinkCommand(
            EntityMapperCommand::ACTION_LINK,
            $this->getEntityClassName(),
            $dto->getId(),
            $articleHistory
        );
        $command->defineLink(
            Article::class,
            $dto->getArticleId(),
            'setArticle',
            true);
        $this->dbActionObserver->registerAction($command);
        // TODO : could be used to update editionDate if history updated ?
        /*$command = new EntityMapperCommand(
            EntityMapperCommand::ACTION_EDIT,
            Article::class,
            $dto->getParentId(),
            null
        );
        $this->dbActionObserver->registerAction($command);*/

        return true;
    }
}