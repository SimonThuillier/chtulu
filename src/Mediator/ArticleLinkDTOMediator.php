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
use App\Serializer\HDateNormalizer;
use App\Utils\HDate;
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
     */
    public function __construct(ContainerInterface $locator)
    {
        parent::__construct($locator);
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
            ->setParentId($articleLink->getParent()->getId())
            ->setChildId($articleLink->getChild()->getId());
    }

    protected function mapDTOParentGroup($mode=DTOMediator::NOTHING_IF_NULL,$subGroups=null)
    {
        /** @var ArticleLink $articleLink */
        $articleLink = $this->entity;
        /** @var ArticleLinkDTO $dto */
        $dto = $this->dto;


        $parent = $articleLink->getParent();

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

        $articleMediator = $this->locator->get(MediatorFactory::class)
                ->create(ArticleDTO::class,$child,null,$mode);
        $articleMediator->mapDTOGroups($subGroups,$mode);
        $dto->setChild($articleMediator->getDTO());
    }

//    protected function mediateGeometry($mapperCommands){
//        /** @var ArticleDTO $dto */
//        $dto = $this->dto;
//        /** @var Article $article */
//        $article = $this->entity;
//
//        if($dto->getGeometry()!==null){
//            $article->setGeometry($dto->getGeometry()->getMediator()->getEntity());
//            $mapperCommands = $dto->getGeometry()->getMediator()->returnDataToEntity($mapperCommands);
//        }
//        else{
//            $article->setGeometry(null);
//        }
//        return $mapperCommands;
//    }
}