<?php
namespace AppBundle\Form;

use AppBundle\Entity\ArticleType;
use AppBundle\Form\Type\HDateType;
use AppBundle\Test;
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
