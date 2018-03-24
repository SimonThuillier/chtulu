<?php
namespace AppBundle\Form;

use AppBundle\Test;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class TestType extends AbstractType
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
            ->add('hDate', HDateType::class, array(
                'label' => 'hDate'
            ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => Test::class
        ));
    }
}
