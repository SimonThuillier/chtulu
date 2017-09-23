<?php

namespace AppBundle\Mapper;

use Symfony\Component\Form\Exception\LogicException;
use AppBundle\DTO\ArticleCollectionDTO;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use AppBundle\Factory\EntityFactoryInterface;
use AppBundle\Factory\PaginatorFactoryInterface;
use AppBundle\Entity\User;
use AppBundle\DTO\ArticleModalDTO;
use AppBundle\Factory\ArticleLinkFactory;
use AppBundle\Factory\ArticleFactory;
use AppBundle\Entity\Article;

/**
 * Class ArticleCollectionDoctrineMapper
 *
 * @package AppBundle\Mapper
 */
class ArticleCollectionDoctrineMapper extends ArticleMainDoctrineMapper
{
    /** @var ArticleModalDoctrineMapper $modalMapper */
    private $modalMapper;
    
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
        ArticleModalDoctrineMapper $modalMapper,
        ArticleLinkFactory $linkFactory
        )
    { 
        parent::__construct($doctrine, $entityName,$entityFactory,$paginatorFactory,$user,$linkFactory);
        $this->modalMapper = $modalMapper;
    }
    
    /**
     * @param ArticleCollectionDTO $dto
     */
    public function add($dto)
    {
        $article = parent::add($dto);
        $this->handleChildrenArticle($article, $dto);
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
     * @param Article $article
     * @param ArticleCollectionDTO $dto
     */
    private function handleChildrenArticle(Article $article ,ArticleCollectionDTO $dto)
    {
        /** @var ArticleModalDTO $modalDTO */
        foreach($dto->subEventsArray as $modalDTO){
            $modalDTO->parentArticle = $article;
            $this->modalMapper->add($modalDTO);
        }
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
