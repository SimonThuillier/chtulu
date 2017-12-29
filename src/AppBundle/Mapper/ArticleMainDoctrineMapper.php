<?php

namespace AppBundle\Mapper;

use Psr\Log\LoggerInterface;
use Symfony\Component\Form\Exception\LogicException;
use AppBundle\DTO\ArticleCollectionDTO;
use AppBundle\DTO\ArticleAbstractDTO;
use AppBundle\DTO\ArticleModalDTO;
use AppBundle\DTO\ArticleMainDTO;
use AppBundle\Entity\Article;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use AppBundle\Factory\ArticleFactory;
use AppBundle\Factory\PaginatorFactoryInterface;
use AppBundle\Entity\User;
use AppBundle\Factory\EntityFactoryInterface;
use AppBundle\Factory\ArticleLinkFactory;

/**
 * Class ArticleCollectionDoctrineMapper
 *
 * @package AppBundle\Mapper
 */
class ArticleMainDoctrineMapper extends ArticleModalDoctrineMapper
{
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
        ArticleLinkFactory $linkFactory,
        LoggerInterface $logger
        )
    {
        parent::__construct($doctrine, $entityName,$entityFactory,$paginatorFactory,$user,$linkFactory,$logger);
    }
    
    
    
    
    /**
     * @param ArticleMainDTO $dto
     */
    public function add($dto)
    {
        parent::add($dto);
    }

    /**
     * @param integer $id
     * @param  $dto
     */
    public function edit($id, $dto)
    {
        parent::edit($id,$dto);
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
        $this->logger->info("j'ai recherché des articles (main) !");
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
