<?php

namespace AppBundle\DTO;

class ArticleCollectionDTO
{
    /** integer $count */
    public $count;
    /** array $data */
    public $data;
    
    
    public function __construct()
    {
        $this->data = [];
    } 
    
    
    
    
    
}