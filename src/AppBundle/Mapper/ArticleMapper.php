<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 27/03/18
 * Time: 23:57
 */

namespace AppBundle\Mapper;

use AppBundle\DTO\EntityMutableDTO;
use AppBundle\Entity\Article;
use AppBundle\Factory\ArticleFactory;
use AppBundle\Factory\FactoryException;
use AppBundle\Mediator\NullColleagueException;
use Psr\Log\LoggerInterface;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ArticleMapper extends AbstractEntityMapper implements EntityMapperInterface
{
    /**
     * ArticleMapper constructor.
     *
     * @param ManagerRegistry $doctrine
     * @param ArticleFactory $entityFactory
     * @param LoggerInterface $logger
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(
        ManagerRegistry $doctrine,
        TokenStorageInterface $tokenStorage,
        LoggerInterface $logger,
        ArticleFactory $entityFactory
    )
    {
        $this->entityClassName = Article::class;
        parent::__construct(
            $doctrine,
            $tokenStorage,
            $logger,
            $entityFactory
            );
    }

    /**
     * @param EntityMutableDTO $dto
     * @param boolean $commit
     * @return Article
     * @throws FactoryException
     * @throws NullColleagueException
     * @throws EntityMapperException
     */
    public function add(EntityMutableDTO $dto,$commit=true)
    {
        $this->checkAdd($dto);
        /** @var Article $article */
        $article = $this->defaultAdd($dto);
        $article
            ->setEditionDate(new \DateTime())
            ->setEditionUser($this->getUser());
        if($commit){
            $this->getManager()->flush();
            $dto->setId($article->getId());
        }
        return $article;
    }

    /**
     * @param EntityMutableDTO $dto
     * @param integer|null $id
     * @param boolean $commit
     * @return Article
     * @throws EntityMapperException
     * @throws NullColleagueException
     */
    public function edit(EntityMutableDTO $dto,$id=null,$commit=true)
    {
        $this->checkEdit($dto,$id);
        /** @var Article $article */
        $article = $this->defaultEdit($dto,$id);
        $article
            ->setEditionDate(new \DateTime())
            ->setEditionUser($this->getUser());
        if($commit) $this->getManager()->flush();
        return $article;
    }

    /**
     * @param int $id
     * @return string
     * @throws EntityMapperException
     */
    public function confirmDelete(int $id)
    {
        /** @var Article $article */
        $article = $this->find($id);
        return "êtes vous sûr de vouloir supprimer l'article " . $article->getTitle() . " ?";
    }

    /**
     * @param integer $id
     * @param boolean $commit
     * @throws EntityMapperException
     */
    public function delete(int $id,$commit=true)
    {
        $this->checkDelete($id);
        $this->defaultDelete($id);
        $this->getManager()->flush();
    }

    /**
     * @inheritdoc
     */
    public function getFindAllQB()
    {
        return $this->repository->createQueryBuilder('o')
            ->select('o')
            ->orderBy('o.editionDate','DESC');
    }
}