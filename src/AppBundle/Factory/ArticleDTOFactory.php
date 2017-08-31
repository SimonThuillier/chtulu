<?php

namespace AppBundle\Factory;

use Symfony\Bridge\Doctrine\ManagerRegistry;
use AppBundle\Service\DTO\ArticleDTO;
use Doctrine\ORM\EntityRepository;
use AppBundle\Entity\ArticleType;
use AppBundle\Entity\ArticleSubType;


class ArticleDTOFactory{
    
    /** ManagerRegistry $doctrine */
    private $doctrine;
    /** ArticleDTO $articleDTO */
    private $articleDTO;
    /** EntityRepository $typeRepo */
    private $typeRepo;
    /** EntityRepository $subTypeRepo */
    private $subTypeRepo;
    
    
    
    /**
     * @param ManagerRegistry $doctrine
     */
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
        $this->typeRepo = $this->doctrine->getManager()->getRepository("AppBundle\Entity:ArticleType");
        $this->subTypeRepo = $this->doctrine->getManager()->getRepository('AppBundle\Entity:SubArticleType');
    }
    
    /**
     * create a new ArticleDTO object : flag can be main or modal (the modal type has special values for js replacement)
     * @param string $flag
     * @return ArticleDTO
     */
    public function newInstance($flag = "main")
    {
        $this->articleDTO = new ArticleDTO();
    }
    
    /**
     * @param string $flag
     * @return self
     */
    public function setData($flag = "main")
    {
        if($flag === "modal"){$this->setDataModal();}
        return $this;
    }
    
    
    /**
     * @return self
     */
    private function setDataMain()
    {
        /** ArticleType $type */
        $type = $this->typeRepo->find(ArticleType::EVENT);
        /** ArticleSubType $subType */
        $subType = $this->typeRepo->find(ArticleSubType::EVENT_LONG);
        $this->articleDTO->setType($type);
        $this->articleDTO->setSubType($subType);
    }
    
    /**
     * @return self
     */
    private function setDataModal()
    {
        /** ArticleType $type */
        $type = $this->typeRepo->find(ArticleType::EVENT);
        /** ArticleSubType $subType */
        $subType = $this->typeRepo->find(ArticleSubType::EVENT_SHORT);
        
        $this->articleDTO->setType($type);
        $this->articleDTO->setSubType($subType);
        $this->articleDTO->setTitle("<_TITLE_>");
        $this->articleDTO->setAbstract("<_ABSTRACT_>");
        $this->articleDTO->setBeginDate("<_BEGIN_DATE_>");
        $this->articleDTO->setMinBeginDate("<_MIN_BEGIN_DATE_>");
        $this->articleDTO->setMaxBeginDate("<_MAX_BEGIN_DATE_>");
        $this->articleDTO->setEndDate("<_End_DATE_>");
        $this->articleDTO->setMinEndDate("<_MIN_END_DATE_>");
        $this->articleDTO->setMaxEndDate("<_MAX_END_DATE_>");
    }
     
}