<?php

namespace AppBundle\Repository;

use AppBundle\Entity\ArticleLink;

/**
 * articleLinkRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class ArticleLinkRepository extends \Doctrine\ORM\EntityRepository
{
    /**
     * 
     * @param integer $parentId
     * @param integer $childId
     * @return ArticleLink|NULL
     */
    public function findByParentChild($parentId,$childId)
    {
        $qb = $this->createQueryBuilder('l')
        ->where('l.parentArticle = :parent')
        ->andWhere('l.childArticle = :child');
        
        return $qb->getQuery()
        ->getOneOrNullResult();
    }
    
    
    
}
