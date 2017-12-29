<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 30/12/17
 * Time: 00:29
 */

namespace AppBundle\Twig;

use AppBundle\Entity\Article;
use AppBundle\Helper\ArticleHelper;

class AppExtension extends \Twig_Extension
{
    /**
     * @var \AppBundle\Helper\ArticleHelper
     */
    private $articleHelper;


    public function __construct(ArticleHelper $articleHelper)
    {
        $this->articleHelper = $articleHelper;
    }


    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('article_encode', array($this, 'articleEncode')),
        );
    }

    public function articleEncode(Article $article)
    {

        return $this->articleHelper->serializeArticle($article);
    }

    public function getName()
    {
        return 'app_extension';
    }
}