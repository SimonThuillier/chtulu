<?php

namespace AppBundle\Repository;

use Doctrine\ORM\EntityRepository;
use AppBundle\Entity\Article;
use AppBundle\Factory\ArticleDTOFactory;
use AppBundle\Factory\ArticleCollectionDTOFactory;
use AppBundle\DTO\ArticleModalDTO;
use AppBundle\DTO\ArticleMainDTO;
use AppBundle\DTO\ArticleCollectionDTO;
use AppBundle\Helper\StaticHelper;

/**
 * ArticleRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class ArticleRepository extends EntityRepository
{ 
    
    public function bindDTO($id,$dto)
    {
        $qb = $this->createQueryBuilder('a')
        ->select('a')
        ->where('a.id = :id')
        ->setParameter('id', $id);
        /** @var Article $article */
        /** @var ArticleCollectionDTO $dto */
        $article = $qb->getQuery()->getOneOrNullResult();
        if ($article === null)return false;
        $article->bindDTO($dto);
        StaticHelper::finalizeArticleDTO($dto);
        if($dto instanceof ArticleMainDTO || $dto instanceof ArticleCollectionDTO){
            $this->hydrateSubEvents($id, $dto);
        }
        
         return true;
    }
    
    private function hydrateSubEvents($id,$dto)
    {
        $qb = $this->createQueryBuilder('a')
        ->join('a.links','l')
        ->join('l.childArticle','sa')
        ->join('sa.type','t')
        ->join('sa.subType','st')
        ->select('sa.title')
        ->addSelect('t.id as type')
        ->addSelect('st.id as subType')
        ->addSelect('sa.abstract')
        ->addSelect('sa.minBeginDate')
        ->addSelect('sa.maxBeginDate')
        ->addSelect('sa.minEndDate')
        ->addSelect('sa.maxEndDate')
        ->addSelect('l.y')
        ->where('a.id = :id')
        ->setParameter('id', $id);
        
        $results = $qb->getQuery()->getArrayResult();

        foreach ($results as $result){
            $modalDTO = new ArticleModalDTO();
            StaticHelper::mapArrayToObject($result, $modalDTO);
            StaticHelper::finalizeArticleDTO($modalDTO);
            $dto->subEventsArray[] = $modalDTO;
            $dto->subEventsCount++;
        }
    }
    
    

}
