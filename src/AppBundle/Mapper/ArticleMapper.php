<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 27/03/18
 * Time: 23:57
 */

namespace AppBundle\Mapper;


use AppBundle\Entity\Article;
use AppBundle\Entity\User;
use AppBundle\Factory\ArticleFactory;
use AppBundle\Factory\FactoryException;
use AppBundle\Factory\PaginatorFactory;
use AppBundle\Mediator\InvalidCallerException;
use AppBundle\Mediator\NullColleagueException;
use Psr\Log\LoggerInterface;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ArticleMapper extends AbstractEntityMapper implements EntityMapper
{
    /**
     * ArticleMapper constructor.
     *
     * @param ManagerRegistry $doctrine
     * @param ArticleFactory|null $entityFactory
     * @param PaginatorFactory|null $paginatorFactory
     * @param TokenStorageInterface $tokenStorage
     * @param LoggerInterface $logger
     */
    public function __construct(
        ManagerRegistry $doctrine,
        ArticleFactory $entityFactory = null,
        PaginatorFactory $paginatorFactory = null,
        TokenStorageInterface $tokenStorage,
        LoggerInterface $logger
    )
    {
        $this->entityClassName = Article::class;
        parent::__construct(
            $doctrine,
            $entityFactory,
            $paginatorFactory,
            $tokenStorage,
            $logger);
    }

    /**
     * @return Article
     * @throws FactoryException
     * @throws NullColleagueException
     * @throws InvalidCallerException
     * @throws EntityMapperException
     */
    public function add()
    {
        $this->checkAdd();
        /** @var Article $article */
        $article = $this->defaultAdd();
        $article
            ->setEditionDate(new \DateTime())
            ->setEditionUser($this->currentUser);
        $this->getManager()->flush();
        return $article;
    }

    /**
     * @param integer|null $id
     * @return Article
     * @throws EntityMapperException
     * @throws NullColleagueException
     * @throws InvalidCallerException
     */
    public function edit($id=null)
    {
        $this->checkEdit($id);
        /** @var Article $article */
        $article = $this->defaultEdit($id);
        $article
            ->setEditionDate(new \DateTime())
            ->setEditionUser($this->currentUser);
        $this->getManager()->flush();
        return $article;
    }

    /**
     * @param integer $id
     * @throws EntityMapperException
     */
    public function delete(integer $id)
    {
        $this->checkDelete($id);
        $this->defaultDelete($id);
        $this->getManager()->flush();
    }
}