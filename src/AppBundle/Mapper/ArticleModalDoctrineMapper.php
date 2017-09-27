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
use AppBundle\Validator\ArticleModalDTOValidator;
use AppBundle\DTO\ArticleLinkDTO;

/**
 * Class ArticleCollectionDoctrineMapper
 *
 * @package AppBundle\Mapper
 */
class ArticleModalDoctrineMapper extends AbstractDoctrineMapper
{
    /** @var ArticleLinkFactory */
    private $linkFactory;
    /** @var ArticleModalDTOValidator */
    private $modalValidator;
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
        $this->modalValidator = new ArticleModalDTOValidator($doctrine);
    }
    
    
    /**
     * @param ArticleModalDTO $dto
     * @return Article
     */
    public function add($dto)
    {
        if($dto instanceof ArticleModalDTO){
            $this->modalValidator->validate($dto);
        }
        $article = $this->entityFactory->newInstance($dto);
        $this->getManager()->persist($article);
        $this->getManager()->flush();
        if($dto instanceof ArticleModalDTO){
            $dto->link = $this->handleLink($article, $dto);
        }
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
     * @return ArticleLink|null
     */
    private function handleLink(Article $article,$dto)
    {  
        if($dto->parentArticle === null && $dto->parentId === null) return null;
        
        $link = $dto->link;
        if ($link === null){
            if($dto->parentArticle === null){
                $dto->parentArticle = $this->doctrine->getRepository('AppBundle:Article')->find($dto->parentId);
            }
            $link = $this->linkFactory->newInstance(new ArticleLinkDTO($dto->parentArticle, $article, $dto->y));
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
