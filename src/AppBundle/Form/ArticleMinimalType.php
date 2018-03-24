<?php
namespace AppBundle\Form;

use AppBundle\DTO\ArticleDTO;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use AppBundle\Entity\ArticleType;
use Doctrine\ORM\EntityRepository;

class ArticleMinimalType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->setMethod('POST')
            ->add('title', TextType::class, array(
            'label' => 'Titre',
            'required' => true,
            'attr' => array(
                'class' => 'hbase-hmaxlength',
                'maxlength' => 60,
                'size'=>60
            ),
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
            'required' => true,
            'empty_data' => 'Selectionnez un type d\'article'
        ))
            ->add('abstract', TextareaType::class, array(
            'label' => "Resumé ",
            'attr' => array(
                'class' => 'hbase-hmaxlength hbase-text',
                'maxlength' => 2000
            )
        ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => ArticleDTO::class,
            'allow_extra_fields' => true
        ));
    }
}
