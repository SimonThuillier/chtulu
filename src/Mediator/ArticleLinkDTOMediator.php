<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 24/03/18
 * Time: 00:46
 */

namespace App\Mediator;


use App\DTO\ArticleDTO;
use App\DTO\ArticleLinkDTO;
use App\Entity\Article;
use App\Entity\ArticleLink;
use App\Factory\MediatorFactory;
use App\Observer\DBActionObserver;
use App\Util\AuthorizationBag;
use App\Util\Command\EntityMapperCommand;
use App\Util\Command\LinkCommand;
use Doctrine\Common\Persistence\ManagerRegistry;
use Psr\Container\ContainerInterface;

class ArticleLinkDTOMediator extends DTOMediator
{
    const DTO_CLASS_NAME = ArticleLinkDTO::class;
    const ENTITY_CLASS_NAME = ArticleLink::class;

    /**
     * ArticleLinkDTOMediator constructor.
     * @param ContainerInterface $locator
     * @param DBActionObserver $dbActionObserver
     */
    public function __construct(ContainerInterface $locator, DBActionObserver $dbActionObserver,$user)
    {
        parent::__construct($locator,$dbActionObserver,$user);
        $this->dtoClassName = self::DTO_CLASS_NAME;
        $this->entityClassName = self::ENTITY_CLASS_NAME;
        $this->groups = ['minimal','parent','child'];
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
        /** @var ArticleLink $articleLink */
        $articleLink = $this->entity;
        /** @var ArticleLinkDTO $dto */
        $dto = $this->dto;
        $dto->setId($articleLink->getId());
        $dto
            ->setAbstract($articleLink->getAbstract())
            ->setParentId($articleLink->getParent()?$articleLink->getParent()->getId():null)
            ->setChildId($articleLink->getChild()?$articleLink->getChild()->getId():null);
    }

    protected function mapDTOParentGroup($mode=DTOMediator::NOTHING_IF_NULL,$subGroups=null)
    {
        /** @var ArticleLink $articleLink */
        $articleLink = $this->entity;
        /** @var ArticleLinkDTO $dto */
        $dto = $this->dto;


        $parent = $articleLink->getParent();
        if($parent === null) return;

        $articleMediator = $this->locator->get(MediatorFactory::class)
            ->create(ArticleDTO::class,$parent->getId(),$parent,null,$mode);
        $articleMediator->mapDTOGroups($subGroups,$mode);
        $dto->setParent($articleMediator->getDTO());
    }

    protected function mapDTOChildGroup($mode=DTOMediator::NOTHING_IF_NULL,$subGroups=null)
    {
        /** @var ArticleLink $articleLink */
        $articleLink = $this->entity;
        /** @var ArticleLinkDTO $dto */
        $dto = $this->dto;


        $child = $articleLink->getChild();
        if($child === null) return;

        $articleMediator = $this->locator->get(MediatorFactory::class)
                ->create(ArticleDTO::class,$child->getId(),$child,null,$mode);
        $articleMediator->mapDTOGroups($subGroups,$mode);
        $dto->setChild($articleMediator->getDTO());
    }

    protected function mediateParentId(){
        /** @var ArticleLinkDTO $dto */
        $dto = $this->dto;
        /** @var ArticleLink $articleLink */
        $articleLink = $this->entity;
        /** @var Article $article */
        $article = null;

        if($dto->getParentId() === null) return true;

        $command = new LinkCommand(
            EntityMapperCommand::ACTION_LINK,
            $this->getEntityClassName(),
            $dto->getId(),
            $articleLink
        );
        $command->defineLink(
            Article::class,
            $dto->getParentId(),
            'setParent',
            true);
        $this->dbActionObserver->registerAction($command);
        // for update of parent article children count
        $command = new EntityMapperCommand(
            EntityMapperCommand::ACTION_EDIT,
            Article::class,
            $dto->getParentId(),
            null
        );
        $this->dbActionObserver->registerAction($command);

        return true;
    }

    protected function mediateChildId()
    {
        /** @var ArticleLinkDTO $dto */
        $dto = $this->dto;
        /** @var ArticleLink $articleLink */
        $articleLink = $this->entity;
        /** @var Article $article */
        $article = null;

        if($dto->getChildId() === null) return true;

        $command = new LinkCommand(
            EntityMapperCommand::ACTION_LINK,
            $this->getEntityClassName(),
            $dto->getId(),
            $articleLink
        );
        $command->defineLink(
            Article::class,
            $dto->getChildId(),
            'setChild',
            true);
        $this->dbActionObserver->registerAction($command);

        return true;
    }

    protected function onDelete(){
        /** @var ArticleLink $articleLink */
        $articleLink = $this->entity;
        $parentArticle = $articleLink->getParent();

        if($parentArticle!==null){
            $parentArticle->setFirstRankLinksCount($parentArticle->getFirstRankLinksCount()-1);
            $command = new EntityMapperCommand(
                EntityMapperCommand::ACTION_EDIT,
                Article::class,
                $parentArticle->getId(),
                $parentArticle
            );
            $this->dbActionObserver->registerAction($command);
        }
    }
}