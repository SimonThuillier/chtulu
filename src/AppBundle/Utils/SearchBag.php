<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 15/05/18
 * Time: 23:27
 */

namespace AppBundle\Utils;


class SearchBag
{
    /** @var mixed */
    private $search;
    /** @var string */
    private $sort;
    /** @var string */
    private $order;
    /** @var int */
    private $offset;
    /** @var int */
    private $limit;

    /**
     * searchBag constructor.
     */
    public function __construct()
    {
        return $this;
    }

    public function __toString()
    {
        $str = "searchKeys : [" .
            ( ($this->search && is_array($this->search)) ?join(",",array_keys($this->search)):"" ).
        "]";
        $str .= " ; sort : " . $this->sort;
        $str.= " ; order : " . $this->order;
        $str.="; offset : " . $this->offset;
        $str.="; limit : " . $this->limit;
        return $str;
    }

    /**
     * @return mixed
     */
    public function getSearch()
    {
        return $this->search;
    }

    /**
     * @param mixed $search
     * @return searchBag
     */
    public function setSearch($search)
    {
        $this->search = $search;
        return $this;
    }

    /**
     * @return string
     */
    public function getSort(): string
    {
        return $this->sort;
    }

    /**
     * @param string $sort
     * @return searchBag
     */
    public function setSort(string $sort): searchBag
    {
        $this->sort = $sort;
        return $this;
    }

    /**
     * @return string
     */
    public function getOrder(): string
    {
        return $this->order;
    }

    /**
     * @param string $order
     * @return searchBag
     */
    public function setOrder(string $order): searchBag
    {
        $this->order = $order;
        return $this;
    }

    /**
     * @return int
     */
    public function getOffset(): int
    {
        return $this->offset;
    }

    /**
     * @param int $offset
     * @return searchBag
     */
    public function setOffset(int $offset): searchBag
    {
        $this->offset = $offset;
        return $this;
    }

    /**
     * @return int
     */
    public function getLimit(): int
    {
        return $this->limit;
    }

    /**
     * @param int $limit
     * @return searchBag
     */
    public function setLimit(int $limit): searchBag
    {
        $this->limit = $limit;
        return $this;
    }

    /**
     * @return searchBag
     */
    static public function createDefault(): searchBag
    {
        $searchBag = new SearchBag();
        $searchBag->setSearch([])
            ->setSort("id")
            ->setOrder("DESC")
            ->setOffset(0)
            ->setLimit(20);

        return $searchBag;
    }

    /**
     * @param searchBag $searchBag
     * @param array $arrayParam
     * @return searchBag
     */
    static public function setFromArray(SearchBag $searchBag,array $arrayParam): searchBag
    {
        if(array_key_exists("search",$arrayParam) && $arrayParam["search"]) $searchBag->setSearch($arrayParam["search"]);
        if(array_key_exists("sort",$arrayParam) && $arrayParam["sort"]) $searchBag->setSort($arrayParam["sort"]);
        if(array_key_exists("order",$arrayParam) && $arrayParam["order"]) $searchBag->setOrder($arrayParam["order"]);
        if(array_key_exists("offset",$arrayParam) && $arrayParam["offset"]) $searchBag->setOffset($arrayParam["offset"]);
        if(array_key_exists("limit",$arrayParam) && $arrayParam["limit"]) $searchBag->setLimit($arrayParam["limit"]);

        return $searchBag;
    }

    /**
     * @param array $arrayParam
     * @return searchBag
     */
    static public function createFromArray(array $arrayParam){
        $searchBag = self::createDefault();
        return self::setFromArray($searchBag,$arrayParam);
    }
}