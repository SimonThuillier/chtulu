<?php

namespace AppBundle\DTO;

class ArticleCollectionDTO
{
    
    /** integer $count */
    private $count;
    /** array $data */
    private $data;
    
    
    public function __construct()
    {
        $this->data = [];
    } 
  

    /**
     * count
     * @return integer
     */
    public function getCount()
    {
        return $this->count;
    }

    /**
     * count
     * @param integer $count
     * @return ArticleCollectionDTO
     */
    public function setCount($count)
    {
        $this->count = $count;
        return $this;
    }

    /**
     * data
     * @return array
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * data
     * @param array $data
     * @return ArticleCollectionDTO
     */
    public function setData($data)
    {
        $this->data = $data;
        return $this;
    }

}