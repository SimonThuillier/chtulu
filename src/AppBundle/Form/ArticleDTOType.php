<?php
namespace AppBundle\Form;

use AppBundle\DTO\ArticleDTO;
use AppBundle\Entity\ArticleType;
use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;

class ArticleDTOType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->setMethod('POST');

        foreach($options['validation_groups'] as $group){
            $function = 'build' . ucfirst($group) . 'Group';
            $this->$function($builder,$options);
        }
    }

    private function buildMinimalGroup(FormBuilderInterface $builder, array $options){

        $builder
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
            ));
    }

    private function buildAbstractGroup(FormBuilderInterface $builder, array $options){

        $builder
        ->add('abstract', TextareaType::class, array(
            'label' => "Resumé ",
            'attr' => array(
                'class' => 'hbase-hmaxlength hbase-text',
                'resize' => 'vertical',
                'maxlength' => 2000
            )
        ));
    }

    private function buildDateGroup(FormBuilderInterface $builder, array $options){

        $builder
            ->add('beginHDate', HDateType::class, array(
                'label' => 'Date de début'
            ))
            ->add('hasEndDate', CheckboxType::class, array(
                'label' => "A une date de fin",
                'required' => false,
                'attr' => array(
                    'class' => 'checkbox icheck hbase-activer',
                    'style' => 'display:inline',
                    'hbase-checked' => '#article_main_endDateLabel',
                    'hbase-default-required' => true
                )
            ))
            ->add('endHDate', HDateType::class, array(
                'label' => 'Date de fin'
            ));
    }

    private function buildSubArticlesGroup(FormBuilderInterface $builder, array $options){

        $builder
            ->add('subArticles', TextareaType::class, array(
                'required' => false,
                'label' => 'sous-events'
            ));
    }

    private function buildLinkGroup(FormBuilderInterface $builder, array $options){

        $builder
            ->add('y', TextType::class, array(
                'attr' => array('hidden' => true)
            ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => ArticleDTO::class,
            'allow_extra_fields' => true,
            'attr' => array('class'=>'hb-article-search')
        ));
    }
}
