<?php

namespace AppBundle\Factory;

use Symfony\Bridge\Doctrine\ManagerRegistry;
use AppBundle\DTO\ArticleMainDTO;
use AppBundle\Entity\ArticleType;
use AppBundle\Entity\ArticleSubType;
use AppBundle\DTO\ArticleDTOInterface;


class ArticleDTOFactory{
    
    /** ManagerRegistry $doctrine */
    private $doctrine;
    /** ArticleDTOInterface $articleDTO */
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
        $this->typeRepo = $this->doctrine->getManager()->getRepository("AppBundle:ArticleType");
        $this->subTypeRepo = $this->doctrine->getManager()->getRepository('AppBundle:ArticleSubType');
    }
    
    /**
     * create a new ArticleDTO object : flag can be main or modal (the modal type has special values for js replacement)
     * @param string $flag
     * @return ArticleDTOInterface
     */
    public function newInstance($flag = "main")
    {
        $this->articleDTO = new ArticleMainDTO();
        $this->setData($flag);
        return $this->articleDTO;
    }
    
    /**
     * @param string $flag
     * @return self
     */
    public function setData($flag = "main")
    {
        if($flag === "main"){$this->setDataMain();}
        elseif($flag === "modal"){$this->setDataModal();}
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
        
        /**
         * ArticleMainDTO $this->articleDTO
         */
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
        
        /**
         * ArticleModalDTO $this->articleDTO
         */
        $this->articleDTO->setType($type);
        $this->articleDTO->setSubType($subType);
        $this->articleDTO->setTitle("<_TITLE_>");
        $this->articleDTO->setAbstract("<_ABSTRACT_>");
    }
     
}