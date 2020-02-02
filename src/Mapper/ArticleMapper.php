<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 27/03/18
 * Time: 23:57
 */

namespace App\Mapper;

use App\Entity\ArticleHistory;
use App\Entity\ArticleStatus;
use App\Entity\DTOMutableEntity;
use App\Entity\Article;
use App\Entity\ArticleType;
use App\Factory\ArticleFactory;
use App\Factory\ArticleHistoryFactory;
use App\Serializer\HDateNormalizer;
use App\Serializer\SimpleEntityNormalizer;
use App\Util\HDate;
use Doctrine\ORM\Query\Expr;
use Psr\Log\LoggerInterface;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ArticleMapper extends AbstractEntityMapper implements EntityMapperInterface
{
    /**
     * @var SimpleEntityNormalizer
     */
    private $simpleEntityNormalizer;
    /**
     * @var HDateNormalizer
     */
    private $hDateNormalizer;
    /**
     * @var ArticleHistoryFactory
     */
    private $historyFactory;



    /**
     * ArticleMapper constructor.
     *
     * @param ManagerRegistry $doctrine
     * @param ArticleFactory $entityFactory
     * @param LoggerInterface $logger
     * @param TokenStorageInterface $tokenStorage
     * @param SimpleEntityNormalizer $simpleEntityNormalizer
     * @param HDateNormalizer $hDateNormalizer
     * @param ArticleHistoryFactory $historyFactory
     */
    public function __construct(
        ManagerRegistry $doctrine,
        TokenStorageInterface $tokenStorage,
        LoggerInterface $logger,
        ArticleFactory $entityFactory,
        SimpleEntityNormalizer $simpleEntityNormalizer,
        HDateNormalizer $hDateNormalizer,
        ArticleHistoryFactory $historyFactory
    )
    {
        $this->entityClassName = Article::class;
        $this->simpleEntityNormalizer = $simpleEntityNormalizer;
        $this->hDateNormalizer = $hDateNormalizer;
        $this->historyFactory = $historyFactory;
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
     * @return Article
     * @throws EntityMapperException
     */
    public function add(DTOMutableEntity $entity,$commit=true)
    {
        $this->checkAdd($entity);
        /** @var Article $article */
        $article = $this->defaultAdd($entity);
        $article
            ->setEditionDate(new \DateTime())
            ->setEditionUser($this->getUser());
        if($commit){
            $this->getManager()->flush();
        }

        // add the first mandatory history for the article
        /** @var ArticleHistory $history */
        $history = $this->historyFactory->create();
        $history->setArticle($article);
        $this->defaultAdd($history);
        if($commit){
            $this->getManager()->flush();
        }


        return $article;
    }

    /**
     * @param DTOMutableEntity $entity
     * @param boolean $commit
     * @return Article
     * @throws EntityMapperException
     */
    public function edit(DTOMutableEntity $entity,$commit=true)
    {
        $this->checkEdit($entity);
        /** @var Article $article */
        $article = $this->defaultEdit($entity);
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
        $qb = $this->repository->createQueryBuilder('o');

        // can access article that are either public or whose owner user is this user
        $user = $this->getUser();
        $userCondition ='o.status=' . ArticleStatus::PUBLIC;
        if($user !== null){
            $userCondition = $qb->expr()->orX($userCondition,'o.ownerUser='.$user->getId());
        }


        $qb
            ->select('o')
            // for now we use the shortcut field article status
//            ->join('o.history','currentHistory',Expr\Join::WITH,
//                $qb->expr()->andX(
//                    $qb->expr()->eq('currentHistory.article','o.id'),
//                        'currentHistory.active=true'
//
//                )
//            )
            ->leftJoin('o.type','type')
            ->addSelect('type')
            ->leftJoin('o.detailImage','image')
            ->addSelect('image')
            ->leftJoin('o.geometry','geometry')
            ->addSelect('geometry')
            ->andWhere($userCondition)
            ->orderBy('o.editionDate','DESC');

        $query=$qb->getDQL();
        $truc='la';

        return $qb;

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
                case 'type':
                    $tSearch[$key] = $this->simpleEntityNormalizer->denormalize($value,ArticleType::class);
                    break;
                case 'beginHDate':
                    $tSearch[$key] = $this->hDateNormalizer->denormalize($value,HDate::class);
                    break;
                case 'endHDate':
                    $tSearch[$key] = $this->hDateNormalizer->denormalize($value,HDate::class);
                    break;
                default :
                    $tSearch[$key] = $value;
                    break;
            }
        }
        return $tSearch;
    }
}