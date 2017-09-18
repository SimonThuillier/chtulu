<?php

namespace AppBundle\DTO;

class ArticleCollectionDTO extends ArticleMainDTO
{
    /** integer $subEventsCount */
    public $subEventsCount;
    /** array $subEventsArray */
    public $subEventsArray;
    
    
    public function __construct()
    {
        parent::__construct();
        $this->subEventsArray = [];
    } 
    
    
    
    
    
}