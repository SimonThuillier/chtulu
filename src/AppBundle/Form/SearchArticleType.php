<?php
namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use AppBundle\Entity\Article;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use AppBundle\Entity\ArticleType;
use Doctrine\ORM\EntityRepository;
use AppBundle\Entity\ArticleSubType;
use Symfony\Component\Form\FormBuilderInterface;
use AppBundle\DTO\ArticleCollectionDTO;

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
            ))
            ->add('beginDateLabel', TextType::class, array(
                'label' => 'Date de début',
                'required' => false,
                'attr' => [
                    'class' => 'hts-date-input hbase-hdatepicker',
                    'placeholder' => 'Date de Début',
                    'hbase-default-required' => true
                ]
            ))
            ->add('endDateLabel', TextType::class, array(
                'label' => 'Date de fin',
                'required' => false,
                'attr' => [
                    'class' => 'hts-date-input hbase-hdatepicker',
                    'placeholder' => 'Date de fin',
                    'hbase-default-required' => true
                ]
            ));
    }


    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => ArticleCollectionDTO::class,
            'allow_extra_fields' => true
        ));
    }

}