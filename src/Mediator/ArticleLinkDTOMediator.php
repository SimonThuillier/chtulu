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
use App\DTO\ResourceDTO;
use App\DTO\ResourceGeometryDTO;
use App\Entity\Article;
use App\Entity\ArticleLink;
use App\Factory\MediatorFactory;
use App\Helper\AssetHelper;
use App\Helper\DateHelper;
use App\Observer\DBActionObserver;
use App\Serializer\HDateNormalizer;
use App\Util\HDate;
use Doctrine\Common\Persistence\ManagerRegistry;
use Psr\Container\ContainerInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Serializer\Encoder\EncoderInterface;

class ArticleLinkDTOMediator extends DTOMediator
{
    const DTO_CLASS_NAME = ArticleLinkDTO::class;
    const ENTITY_CLASS_NAME = ArticleLink::class;

    /**
     * ArticleLinkDTOMediator constructor.
     * @param ContainerInterface $locator
     * @param DBActionObserver $dbActionObserver
     */
    public function __construct(ContainerInterface $locator, DBActionObserver $dbActionObserver)
    {
        parent::__construct($locator,$dbActionObserver);
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
            ->create(ArticleDTO::class,$parent,null,$mode);
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
                ->create(ArticleDTO::class,$child,null,$mode);
        $articleMediator->mapDTOGroups($subGroups,$mode);
        $dto->setChild($articleMediator->getDTO());
    }

    protected function mediateParentId($mapperCommands){
        /** @var ArticleLinkDTO $dto */
        $dto = $this->dto;
        /** @var ArticleLink $articleLink */
        $articleLink = $this->entity;
        /** @var Article $article */
        $article = null;

        if($dto->getParentId() === null) return $mapperCommands;
        if($dto->getParentId() > 0){
            $article = $this->locator->get('doctrine')->getRepository(Article::class)->find($dto->getParentId());
            if($article !== null){
                $articleLink->setParent($article);
            }
        }
        else{
            $this->dbActionObserver->askNewEntity(Article::class,$dto->getParentId(),$this,$articleLink,'setParent');
        }

        return $mapperCommands;
    }

    protected function mediateChildId($mapperCommands){
        /** @var ArticleLinkDTO $dto */
        $dto = $this->dto;
        /** @var ArticleLink $articleLink */
        $articleLink = $this->entity;
        /** @var Article $article */
        $article = null;

        if($dto->getChildId() === null) return $mapperCommands;
        if($dto->getChildId() > 0){
            $article = $this->locator->get('doctrine')->getRepository(Article::class)->find($dto->getChildId());
            if($article !== null){
                $articleLink->setChild($article);
            }
        }
        else{
            $this->dbActionObserver->askNewEntity(Article::class,$dto->getChildId(),$this,$articleLink,'setChild');
        }

        return $mapperCommands;
    }
}