<?php
namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use AppBundle\Entity\Article;
use Doctrine\DBAL\Types\TextType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use AppBundle\Entity\ArticleType;
use Doctrine\ORM\EntityRepository;
use AppBundle\Entity\ArticleSubType;
use Symfony\Component\Form\FormBuilderInterface;

/**
 * 
 * @author belze
 *
 */
class SearchArticleType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->setMethod('POST')
        ->add('title', TextType::class, array(
            'label' => 'Titre',
            'required' => false,
            'label_attr' => array(
                'placeholder' => 'Titre'
            )
        ))
        ->add('type', EntityType::class, array(
            'label' => "Type ",
            'class' => ArticleType::class,
            'query_builder' => function (EntityRepository $er) {
            return $er->getFindAllQB();
            },
            'required' => false,
            'empty_data' => ''
                ))
                ->add('subType', EntityType::class, array(
                    'label' => "Sous-type ",
                    'class' => ArticleSubType::class,
                    'query_builder' => function (EntityRepository $er) {
                    return $er->getFindAllQB();
                    },
                    'required' => true,
                    'empty_data' => 'Selectionnez un sous-type'
                        ));
    }
   
    
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => Article::class,
            'allow_extra_fields' => true
        ));
    }
    
}