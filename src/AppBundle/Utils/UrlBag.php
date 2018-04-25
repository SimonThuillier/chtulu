<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 16/04/18
 * Time: 22:11
 */

namespace AppBundle\Utils;

use Symfony\Component\Serializer\Annotation\Groups;


class UrlBag
{
    /** @var string */
    private $view;
    /** @var string */
    private $info;
    /** @var string */
    private $edit;
    /** @var string */
    private $postEdit;
    /** @var string */
    private $admin;

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
    public function getPostEdit()
    {
        return $this->postEdit;
    }

    /**
     * @param string $postEdit
     * @return UrlBag
     */
    public function setPostEdit($postEdit): UrlBag
    {
        $this->postEdit = $postEdit;
        return $this;
    }

    /**
     * @return string
     * @Groups({"adminUrl","url"})
     */
    public function getAdmin()
    {
        return $this->admin;
    }

    /**
     * @param string $admin
     * @return UrlBag
     */
    public function setAdmin($admin): UrlBag
    {
        $this->admin = $admin;
        return $this;
    }



}