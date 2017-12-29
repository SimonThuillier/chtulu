<?php
namespace AppBundle\Form;

use AppBundle\Entity\ArticleType;
use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use AppBundle\DTO\ArticleModalDTO;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use AppBundle\Helper\StaticHelper;

class ArticleModalType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('title', TextType::class, array(
            'label' => 'Titre',
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
            ))
            ->add('beginDateLabel', TextType::class, array(
                'label' => 'Date de début',
                'required' => true,
                'attr' => [
                    'class' => 'hts-date-input hbase-hdatepicker',
                    'placeholder' => 'Date de Début',
                    'hbase-default-required' => true
                ]
            ))
            ->add('hasEndDate', CheckboxType::class, array(
                'label' => "A une date de fin",
                'required' => false,
                'attr' => array(
                    'class' => 'checkbox icheck hbase-activer',
                    'style' => 'display:inline',
                    'hbase-checked' => '#article_modal_live_endDateLabel',
                    'hbase-default-required' => true
                )
            ))
            ->add('endDateLabel', TextType::class, array(
                'label' => 'Date de fin',
                'required' => true,
                'attr' => [
                    'class' => 'hts-date-input hbase-hdatepicker',
                    'placeholder' => 'Date de fin',
                    'hbase-default-required' => true
                ]
            ))
            ->add('y', DateType::class, array(
                'attr' => array('hidden' => true)
            ));
        // ->add('content', TextareaType::class,array('required'=>false,'label'=>''))
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => ArticleModalDTO::class
        ));
    }
}
