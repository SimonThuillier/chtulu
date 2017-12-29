<?php

namespace AppBundle\Validator;


use Symfony\Bridge\Doctrine\ManagerRegistry;
use AppBundle\DTO\ArticleModalDTO;
use AppBundle\Entity\ArticleSubType;
use AppBundle\Entity\ArticleType;

class ArticleModalDTOValidator{
    
    /**
     * @var ManagerRegistry $doctrine
     */
    protected $doctrine;
    
    /**
     * AbstractDoctrineMapper constructor.
     *
     * @param ManagerRegistry $doctrine
     */
    public function __construct(
        ManagerRegistry $doctrine
        )
    {
        $this->doctrine = $doctrine;
    }
    
    /**
     * 
     * @param ArticleModalDTO $dto
     */
    public function validate($dto)
    {
        if(! $dto->type instanceof ArticleType){
            $dto->type = $this->doctrine->getRepository(ArticleType::class)
            ->find($dto->type);
        }
        if(! $dto->subType instanceof ArticleSubType){
            $dto->subType = $this->doctrine->getRepository(ArticleSubType::class)
            ->find($dto->subType);
        }
        if($dto->article === null && $dto->id !== null){
            $dto->article = $this->doctrine->getRepository('AppBundle:Article')
            ->find($dto->id);
        }
        if($dto->parentArticle === null && $dto->parentId !== null){
            $dto->parentArticle = $this->doctrine->getRepository('AppBundle:Article')
            ->find($dto->parentId);
        }
        if($dto->link === null && $dto->linkId !== null){
            $dto->link = $this->doctrine->getRepository('AppBundle:ArticleLink')
            ->find($dto->linkId);
        }
        
        $dto->beginDate = \DateTime::createFromFormat('d/m/Y', $dto->beginDate);
        $dto->maxBeginDate = \DateTime::createFromFormat('d/m/Y', $dto->maxBeginDate);
        $dto->minBeginDate = \DateTime::createFromFormat('d/m/Y', $dto->minBeginDate);
        $dto->endDate = \DateTime::createFromFormat('d/m/Y', $dto->endDate);
        $dto->minEndDate = \DateTime::createFromFormat('d/m/Y', $dto->minEndDate);
        $dto->maxEndDate = \DateTime::createFromFormat('d/m/Y', $dto->maxEndDate);
    }
    
    
    
    
    
}