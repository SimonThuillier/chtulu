<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 27/03/18
 * Time: 23:57
 */

namespace App\Mapper;

use App\Entity\DTOMutableEntity;
use App\Entity\ArticleLink;
use App\Factory\ArticleFactory;
use App\Factory\FactoryException;
use App\Mediator\NullColleagueException;
use Psr\Log\LoggerInterface;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ArticleLinkMapper extends AbstractEntityMapper implements EntityMapperInterface
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
        $this->entityClassName = ArticleLink::class;
        parent::__construct(
            $doctrine,
            $tokenStorage,
            $logger,
            $entityFactory
            );
    }

    /**
     * @param DTOMutableEntity $entity
     * @param boolean $commit
     * @return ArticleLink
     * @throws EntityMapperException
     */
    public function add(DTOMutableEntity $entity,$commit=true)
    {
        $this->checkAdd($entity);
        /** @var ArticleLink $articleLink */
        $articleLink = $this->defaultAdd($entity);
        $articleLink
            ->setEditionDate(new \DateTime())
            ->setEditionUser($this->getUser());
        if($commit){
            $this->getManager()->flush();
        }
        return $articleLink;
    }

    /**
     * @param DTOMutableEntity $entity
     * @param boolean $commit
     * @return ArticleLink
     * @throws EntityMapperException
     */
    public function edit(DTOMutableEntity $entity,$commit=true)
    {
        $this->checkEdit($entity);
        /** @var ArticleLink $articleLink */
        $articleLink = $this->defaultEdit($entity);
        $articleLink
            ->setEditionDate(new \DateTime())
            ->setEditionUser($this->getUser());
        if($commit) $this->getManager()->flush();
        return $articleLink;
    }

    /**
     * @param int $id
     * @return string
     * @throws EntityMapperException
     */
    public function confirmDelete(int $id)
    {
        /** @var ArticleLink $articleLink */
        $articleLink = $this->find($id);
        return "êtes vous sûr de vouloir supprimer l'article Link " . $articleLink->getId() . " ?";
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

    protected function getCountAllQB(){
        return $this->doctrine->getManager()->createQueryBuilder()
            ->from(ArticleLink::class,'o')
            ->select('COUNT(o.id)');
    }

    /**
     * @inheritdoc
     */
    public function getFindAllQB()
    {
        return $this->repository->createQueryBuilder('o')
            ->select('o')
            ->join('o.child','c')
            ->addSelect('c')
            ->orderBy('o.editionDate','DESC');
    }

    /**
     * produces a search part of the searchbag complient with repository filter requirements
     * @param $search
     * @return mixed
     */
    protected function getTransformedSearch($search){
        if ($search === null || !is_array($search)) return [];
        $tSearch = [];
        foreach((array)($search) as $key => $value){
            switch($key){
                default :
                    $tSearch[$key] = $value;
                    break;
            }
        }
        return $tSearch;
    }
}