<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use AppBundle\Entity\Evolution;

class EvolutionType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
        ->add('title',null,array('label' => 'Titre '))
        ->add('beginDateMin',DateType::class,array(
        		'label' => "date de début ",
        		'widget' => 'single_text',
        		'placeholder' => 'jj/MM/yyyy',
        		'format' => 'dd/MM/yyyy',
        		'data' => new \DateTime()
        ))
        ->add('beginDateMax',DateType::class,array(
        		'label' => "date de début ",
        		'widget' => 'text',
        		'data' => new \DateTime()
        ))
        ->add('endDateMin',DateType::class,array(
        		'label' => "date de fin ",
        		'widget' => 'text',
        		'data' => new \DateTime()
        ))
        ->add('endDateMax',DateType::class,array(
        		'label' => "date de fin ",
        		'widget' => 'text',
        		'data' => new \DateTime()
        ))
        ->add ( 'domain', CollectionType::class, array (
				// each entry in the array will be an "email" field
				'label' => "Domaine ",
				'entry_type' => HiddenType::class,
				// these options are passed to each "email" type
				'entry_options' => array (),
       ))
       ->add ( 'article_abstract', TextareaType::class, array (
       		'label' => "Resumé "
       ));
        
    }
    
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => Evolution::class
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'entitybundle_evolution';
    }


}
