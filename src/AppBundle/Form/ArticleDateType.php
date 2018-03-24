<?php
namespace AppBundle\Form;

use AppBundle\DTO\ArticleDTO;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;

class ArticleDateType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->setMethod('POST')
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

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => ArticleDTO::class,
            'allow_extra_fields' => true
        ));
    }
}
