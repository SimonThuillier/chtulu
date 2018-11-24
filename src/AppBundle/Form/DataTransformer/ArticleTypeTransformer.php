<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 00:53
 */

namespace AppBundle\Form\DataTransformer;


use AppBundle\Entity\ArticleType;
use Symfony\Component\Form\DataTransformerInterface;


/**
 * Class ArticleTypeTransformer
 * @package AppBundle\Form\DataTransformer
 */
class ArticleTypeTransformer extends AbstractSimpleEntityTransformer implements DataTransformerInterface
{
    protected $entityClassName=ArticleType::class;
}