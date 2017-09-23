<?php

namespace AppBundle\Mapper;

use Symfony\Component\Form\Exception\LogicException;
use AppBundle\DTO\ArticleCollectionDTO;
use AppBundle\DTO\ArticleAbstractDTO;
use AppBundle\DTO\ArticleModalDTO;
use AppBundle\Entity\Article;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use AppBundle\Factory\ArticleFactory;
use AppBundle\Factory\PaginatorFactoryInterface;
use AppBundle\Entity\User;
use AppBundle\Factory\EntityFactoryInterface;
use AppBundle\Entity\ArticleLink;
use AppBundle\Factory\ArticleLinkFactory;

/**
 * Class ArticleCollectionDoctrineMapper
 *
 * @package AppBundle\Mapper
 */
class ArticleModalDoctrineMapper extends AbstractDoctrineMapper
{
    /** @var ArticleLinkFactory */
    private $linkFactory;
    /**
     * ArticleCollectionDoctrineMapper
     *
     * @param ManagerRegistry $doctrine
     * @param string $entityName
     * @param EntityFactoryInterface|null $entityFactory
     * @param PaginatorFactoryInterface|null $paginatorFactory
     * @param User $user
     */
    public function __construct(
        ManagerRegistry $doctrine,
        string $entityName = Article::class,
        ArticleFactory $entityFactory,
        PaginatorFactoryInterface $paginatorFactory = null,
        User $user = null,
        ArticleLinkFactory $linkFactory
        )
    {
        parent::__construct($doctrine, $entityName,$entityFactory,$paginatorFactory,$user);
        $this->linkFactory = $linkFactory;
    }
    
    
    /**
     * @param ArticleModalDTO $dto
     * @return Article
     */
    public function add($dto)
    {
        $article = $this->entityFactory->newInstance($dto);
        $this->getManager()->persist($article);
        $this->getManager()->flush();
        $dto->link = $this->handleLink($article, $dto);
        return $article;
    }

    /**
     * @param string $id
     * @param  $dto
     */
    public function edit(string $id, $dto)
    {
        /*
        $site = $this->getRepository()->find($id);
        if (!$site) {
            throw new \LogicException(sprintf('impossible to find information for id %s', $id));
        }
        $site->setLabel($dto->label);
        $site->setNumber($dto->number);
        $site->setAccompaniment($dto->accompaniment);
        $this->getManager()->flush();*/
    }
    
    /**
     * @param ArticleModalDTO $dto
     * @return ArticleLink
     */
    private function handleLink(Article $article,ArticleModalDTO $dto)
    {  
        $link = $this->doctrine->getRepository('AppBundle:ArticleLink')
        ->findByParentChild($dto->parentArticle->getId(), $article->getId());
        
        if ($link === null){
            if($dto->parentArticle === null){
                $dto->parentArticle = $this->doctrine->getRepository('AppBundle:Article')->find($dto->parentId);
            }
            $link = $this->linkFactory->newInstance($dto);
            $this->getManager()->persist($link);
        }
        else{
            $this->linkFactory->setEntity($link)->setDto($dto)->setData();
        }
        $this->getManager()->flush();
        return $link;
    }


    /**
     * @param $page
     * @param $maxPage
     * @param null $label
     * @param null $number
     * @param null $accompaniment
     * @return array
     */
    public function findBySearch($page, $maxPage, $label = null, $number = null, $accompaniment = null)
    {
        $paginator = [];
        if ($this->getRepository()->findBySearch($label, $number, $accompaniment) !== null) {
            $query = $this->getRepository()->findBySearch($label, $number, $accompaniment);

            $firstResult = ($page - 1) * $maxPage;
            $query->setFirstResult($firstResult)->setMaxResults($maxPage);
            $paginator = $this->paginatorFactory->newInstance($query);
        }
        return $paginator;
    }

    /**
     * @param $label
     * @return mixed
     */
    public function autocomplete($label)
    {
        $result = $this->getRepository()->autocomplete($label);

        return $result;
    }
}
