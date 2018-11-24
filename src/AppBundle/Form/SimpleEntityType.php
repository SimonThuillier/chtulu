<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 21/03/18
 * Time: 23:02
 */

namespace AppBundle\Form;

use AppBundle\Entity\ArticleType;
use AppBundle\Form\DataTransformer\ArticleTypeTransformer;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class SimpleEntityType extends AbstractType
{
    private $transformers;

    public function __construct(
        ArticleTypeTransformer $articleTypeTransformer
    )
    {
        $this->transformers = [
            ArticleType::class => $articleTypeTransformer
        ];
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->addModelTransformer($this->transformers[$options['data_class']]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'allow_extra_fields' => true,

        ));
    }

    public function getParent()
    {
        return TextType::class;
    }
}