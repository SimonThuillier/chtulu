<?php

namespace AppBundle\Factory;

use AppBundle\DTO\ArticleCollectionDTO;


class ArticleCollectionDTOFactory implements DTOFactoryInterface
{
    
    /** ArticleCollectionDTO $articleCollectionDTO */
    private $articleCollectionDTO;
    
    /**
     *
     */
    public function __construct()
    {
    }
    
    /**
     * create a new ArticleCollectionDTO object
     * @param string $flag
     * @return ArticleCollectionDTO
     */
    public function newInstance()
    {
        $this->articleCollectionDTO = new ArticleCollectionDTO();
        $this->setData();
        return $this->articleCollectionDTO;
    }
    
    /**
     * @param string $flag
     * @return self
     */
    public function setData()
    {
        $this->articleCollectionDTO->subEventsCount=0;
        return $this;
    }
     
}