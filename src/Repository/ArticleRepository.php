<?php
namespace App\Repository;

use App\Entity\ArticleType;
use App\Helper\DateHelper;
use App\Mapper\AutoMapper;
use App\Util\HDate;
use Doctrine\ORM\EntityRepository;
use App\Entity\Article;
use App\Factory\ArticleDTOFactory;
use App\Factory\ArticleCollectionDTOFactory;
use App\DTO\ArticleModalDTO;
use App\DTO\ArticleMainDTO;
use App\DTO\ArticleCollectionDTO;
use App\Helper\StaticHelper;
use Doctrine\ORM\Query;
use Doctrine\ORM\QueryBuilder;

/**
 * ArticleRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class ArticleRepository extends EntityRepository
{
    /**
     * @param QueryBuilder $qb
     * @param ArticleType|null $type
     * @return QueryBuilder
     */
    public function filterByType(QueryBuilder $qb,?ArticleType $type){
        if($type === null) return $qb;
        return $qb->andWhere('o.type = :type')
            ->setParameter('type',$type);
    }

    /**
     * @param QueryBuilder $qb
     * @param string $order
     * @return QueryBuilder
     */
    public function sortByTitle(QueryBuilder $qb,string $order){
        return $qb->orderBy('o.title',$order);
    }

    /**
     * @param QueryBuilder $qb
     * @param string|null $keyword
     * @return QueryBuilder
     */
    public function filterByKeyword(QueryBuilder $qb,?string $keyword){
        if($keyword === null || $keyword === "") return $qb;
        $keywordPieces = explode(':',$keyword);

        $conditions = [];
        foreach ($keywordPieces as $piece){
            $piece = "'%" . strtolower(trim($piece)) . "%'";
            $conditions[] = $qb->expr()->orX(
                $qb->expr()->like($qb->expr()->lower('o.title'),$piece),
                $qb->expr()->like($qb->expr()->lower('o.abstract'),$piece)
            );
        }

        $condition = $qb->expr()->orX()->addMultiple($conditions);

        return $qb->andWhere($condition);
    }

    /**
     * @param QueryBuilder $qb
     * @param string $order
     * @return QueryBuilder
     */
    public function sortByType_label(QueryBuilder $qb,string $order){
        return $qb->join('o.type','t')
        ->orderBy('t.label',$order);
    }

    /**
     * @param QueryBuilder $qb
     * @param HDate|null $hDate
     * @return QueryBuilder
     */
    public function filterByBeginHDate(QueryBuilder $qb,?HDate $hDate){
        if($hDate === null) return $qb;
        return $qb->andWhere('(o.endDateType IS NULL OR o.endDateMaxIndex >= :beginDateMinIndex)')
            ->setParameter('beginDateMinIndex', DateHelper::dateToIndex($hDate->getBeginDate()));
    }

    /**
     * @param QueryBuilder $qb
     * @param string $order
     * @return QueryBuilder
     */
    public function sortByBeginHDate(QueryBuilder $qb,string $order){
        return $qb->orderBy('o.beginDateMinIndex',$order);
    }

    /**
     * @param QueryBuilder $qb
     * @param HDate|null $hDate
     * @return QueryBuilder
     */
    public function filterByEndHDate(QueryBuilder $qb,?HDate $hDate){
        if($hDate === null) return $qb;
        return $qb->andWhere('(o.beginDateType IS NULL OR o.beginDateMinIndex <= :endDateMaxIndex)')
            ->setParameter('endDateMaxIndex', DateHelper::dateToIndex($hDate->getEndDate()));
    }

    /**
     * @param QueryBuilder $qb
     * @param string $order
     * @return QueryBuilder
     */
    public function sortByEndHDate(QueryBuilder $qb,string $order){
        return $qb->orderBy('o.endDateMaxIndex',$order);
    }

    /**
     * @param QueryBuilder $qb
     * @param int|null $ownerId
     * @return QueryBuilder
     */
    public function filterByOwnerId(QueryBuilder $qb,$ownerId){
        if($ownerId === null) return $qb;
        return $qb->andWhere('(o.ownerUser = :ownerId)')
            ->setParameter('ownerId', $ownerId);
    }

    /**
     * @param QueryBuilder $qb
     * @param string $order
     * @return QueryBuilder
     */
    public function sortByEditionDate(QueryBuilder $qb,string $order){
        return $qb->orderBy('o.editionDate',$order);
    }

    /**
     * @param QueryBuilder $qb
     * @param string $order
     * @return QueryBuilder
     */
    public function sortByFirstRankLinksCount(QueryBuilder $qb,string $order){
        return $qb->orderBy('o.firstRankLinksCount',$order);
    }
}
