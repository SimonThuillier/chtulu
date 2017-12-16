<?php

namespace AppBundle\Mapper;

use Psr\Log\LoggerInterface;
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
use AppBundle\Repository\ArticleRepository;

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
        ArticleLinkFactory $linkFactory,
        LoggerInterface $logger
        )
    {
        parent::__construct($doctrine, $entityName,$entityFactory,$paginatorFactory,$user,$logger);
        $this->linkFactory = $linkFactory;
        $this->modalValidator = new ArticleModalDTOValidator($doctrine);
    }
    
    
    /**
     * @param ArticleModalDTO $dto
     */
    public function add($dto)
    {
        if($dto instanceof ArticleModalDTO){
            $this->modalValidator->validate($dto);
        }
        $dto->article = $this->entityFactory->newInstance($dto);
        $this->getManager()->persist($dto->article);
        $this->getManager()->flush();
        if($dto instanceof ArticleModalDTO){
                $this->addLink($dto);
        }
    }

    /**
     * @param integer $id
     * @param  $dto
     * @throws \Exception
     */
    public function edit($id, $dto)
    {
        if($dto instanceof ArticleModalDTO){
            $this->modalValidator->validate($dto);
        }
        /** @var ArticleRepository $repo */
        $repo = $this->doctrine->getRepository($this->entityName);
        $dto->article = $repo->find($id);
        if($dto->article === null) throw new \LogicException(sprintf('impossible to find information for id %s', $id));
        
        $this->entityFactory->setData($dto,$dto->article);
        $this->getManager()->flush();
        
        if($dto instanceof ArticleModalDTO){
            if($dto->link === null){
                $this->addLink($dto);
            }
            else{
                $this->editLink($dto);
            }
        }
    }
    
    /**
     * @param ArticleModalDTO $dto
     */
    private function editLink($dto)
    {  
        $this->linkFactory->setData(
            new ArticleLinkDTO($dto->parentArticle, $dto->article, $dto->y)
            ,$dto->link);
        $this->getManager()->flush();
    }
    
    /**
     * @param ArticleModalDTO $dto
     */
    private function addLink($dto)
    {
        $dto->link = $this->linkFactory->newInstance(new ArticleLinkDTO($dto->parentArticle, $dto->article, $dto->y));
        $this->getManager()->persist($dto->link);
        $this->getManager()->flush();
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
        $this->logger->info("j'ai recherché des articles (modal)!");
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
