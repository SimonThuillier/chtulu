<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 16/04/18
 * Time: 22:11
 */

namespace App\Util;

use Symfony\Component\Serializer\Annotation\Groups;


class UrlBag
{
    /** @var string */
    private $view="";
    /** @var string */
    private $info="";
    /** @var string */
    private $edit="";
    /** @var string */
    private $post="";
    /** @var string */
    private $delete="";
    /** @var string */
    private $cancel="";

    /**
     * @return string
     * @Groups({"readUrl","url"})
     *
     */
    public function getView()
    {
        return $this->view;
    }

    /**
     * @param string $view
     * @return UrlBag
     */
    public function setView($view): UrlBag
    {
        $this->view = $view;
        return $this;
    }

    /**
     * @return string
     * @Groups({"readUrl","url"})
     */
    public function getInfo()
    {
        return $this->info;
    }

    /**
     * @param string $info
     * @return UrlBag
     */
    public function setInfo($info): UrlBag
    {
        $this->info = $info;
        return $this;
    }

    /**
     * @return string
     * @Groups({"editUrl","url"})
     */
    public function getEdit()
    {
        return $this->edit;
    }

    /**
     * @param string $edit
     * @return UrlBag
     */
    public function setEdit($edit): UrlBag
    {
        $this->edit = $edit;
        return $this;
    }

    /**
     * @return string
     * @Groups({"editUrl","url"})
     */
    public function getPost()
    {
        return $this->post;
    }

    /**
     * @param string $post
     * @return UrlBag
     */
    public function setPost($post): UrlBag
    {
        $this->post = $post;
        return $this;
    }

    /**
     * @return string
     * @Groups({"editUrl","url"})
     */
    public function getDelete()
    {
        return $this->delete;
    }

    /**
     * @param string $delete
     * @return UrlBag
     */
    public function setDelete($delete): UrlBag
    {
        $this->delete = $delete;
        return $this;
    }



    /**
     * @return string
     * @Groups({"editUrl","url"})
     */
    public function getCancel()
    {
        return $this->cancel;
    }

    /**
     * @param string $cancel
     * @return UrlBag
     */
    public function setCancel($cancel): UrlBag
    {
        $this->cancel = $cancel;
        return $this;
    }



}