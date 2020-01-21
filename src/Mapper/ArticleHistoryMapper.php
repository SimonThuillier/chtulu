<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 27/03/18
 * Time: 23:57
 */

namespace App\Mapper;

use App\Entity\DTOMutableEntity;
use App\Entity\ArticleHistory;
use App\Factory\ArticleFactory;
use App\Factory\FactoryException;
use App\Mediator\NullColleagueException;
use Psr\Log\LoggerInterface;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ArticleHistoryMapper extends AbstractEntityMapper implements EntityMapperInterface
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
        $this->entityClassName = ArticleHistory::class;
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
     * @return ArticleHistory
     * @throws EntityMapperException
     */
    public function add(DTOMutableEntity $entity,$commit=true)
    {
        $this->checkAdd($entity);
        /** @var ArticleHistory $articleHistory */
        $articleHistory = $this->defaultAdd($entity);
        $articleHistory
            ->setEditionDate(new \DateTime())
            ->setEditionUser($this->getUser());
        if($commit){
            $this->getManager()->flush();
        }
        return $articleHistory;
    }

    /**
     * @param DTOMutableEntity $entity
     * @param boolean $commit
     * @return ArticleHistory
     * @throws EntityMapperException
     */
    public function edit(DTOMutableEntity $entity,$commit=true)
    {
        $this->checkEdit($entity);
        /** @var ArticleHistory $articleHistory */
        $articleHistory = $this->defaultEdit($entity);
        $articleHistory
            ->setEditionDate(new \DateTime())
            ->setEditionUser($this->getUser());
        if($commit) $this->getManager()->flush();
        return $articleHistory;
    }

    /**
     * @param int $id
     * @return string
     * @throws EntityMapperException
     */
    public function confirmDelete(int $id)
    {
        /** @var ArticleHistory $articleHistory */
        $articleHistory = $this->find($id);
        return "êtes vous sûr de vouloir supprimer l'article History " . $articleHistory->getId() . " ?";
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
            ->from(ArticleHistory::class,'o')
            ->select('COUNT(o.id)');
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