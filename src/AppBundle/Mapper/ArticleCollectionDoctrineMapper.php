<?php

namespace AppBundle\Mapper;

use Psr\Log\LoggerInterface;
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
use AppBundle\Helper\ArticleHelper;

/**
 * Class ArticleCollectionDoctrineMapper
 *
 * @package AppBundle\Mapper
 */
class ArticleCollectionDoctrineMapper extends ArticleMainDoctrineMapper
{
    /** @var ArticleModalDoctrineMapper $modalMapper */
    private $modalMapper;
    /** @var ArticleHelper */
    private $articleHelper;
    
    /**
     * ArticleCollectionDoctrineMapper
     *
     * @param ManagerRegistry $doctrine
     * @param string $entityName
     * @param EntityFactoryInterface|null $entityFactory
     * @param PaginatorFactoryInterface|null $paginatorFactory
     * @param User $user
     * @param ArticleModalDoctrineMapper $modalMapper
     * @param ArticleLinkFactory $linkFactory
     * @param ArticleHelper $helper
     */
    public function __construct(
        ManagerRegistry $doctrine,
        string $entityName = Article::class,
        ArticleFactory $entityFactory,
        PaginatorFactoryInterface $paginatorFactory = null,
        User $user = null,
        ArticleModalDoctrineMapper $modalMapper,
        ArticleLinkFactory $linkFactory,
        ArticleHelper $helper,
        LoggerInterface $logger
        )
    { 
        parent::__construct($doctrine, $entityName,$entityFactory,$paginatorFactory,$user,$linkFactory,$logger);
        $this->articleHelper = $helper;
        $this->modalMapper = $modalMapper;
    }
    
    /**
     * @param ArticleCollectionDTO $dto
     * @throws \Exception
     */
    public function add($dto)
    {
        try{
            $this->articleHelper->deserializeDates($dto);
        }
        catch(\Exception $e){throw new \Exception("An error occured during dates recovery. No data was saved.");}
        try{
            $this->articleHelper->deserializeSubEvents($dto);
        }
        catch(\Exception $e){throw new \Exception("An error occured during subArticles recovery. No data was saved.");}

        parent::add($dto);
        $this->handleChildrenArticle($dto->article, $dto);
    }

    /**
     * @param integer $id
     * @param  $dto
     */
    public function edit($id, $dto)
    {
        if (! $this->articleHelper->deserializeSubEvents($dto)){
            throw new \Exception("An error occured during subArticles recovery. No data was saved.");
        }
        parent::edit($id,$dto);
        $this->handleChildrenArticle($dto->article, $dto);
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
            $modalDTO->parentId = $article->getId();
            if($modalDTO->id === null){
                $this->modalMapper->add($modalDTO);
            }
            else{
                $this->modalMapper->edit($modalDTO->id,$modalDTO);
            }
        }
    }

    /**
     * @param $page
     * @param $maxPage
     * @param string|null $title
     * @param null $type
     * @param null $subType
     * @return array
     */
    public function findBySearch($page,
        $maxPage,
        $title = null,
        $type = null, 
        $subType = null)
    {
        $paginator = [];
        if ($this->getRepository()->findBySearch($title, $type, $subType) !== null) {
            $query = $this->getRepository()->findBySearch($title, $type, $subType);

            $firstResult = ($page - 1) * $maxPage;
            $query->setFirstResult($firstResult)->setMaxResults($maxPage);
            $paginator = $this->paginatorFactory->newInstance($query);
        }
        $this->logger->info("j'ai recherché des articles (collection)! : ");

        foreach($paginator as $article){
            $this->logger->info($article);
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
