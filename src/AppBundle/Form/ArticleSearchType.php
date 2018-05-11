<?php
namespace AppBundle\Form;

use AppBundle\DTO\ArticleDTO;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use AppBundle\Entity\ArticleType;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\Form\FormBuilderInterface;

/**
 *
 * @author belze
 *
 */
class ArticleSearchType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->setMethod('POST')
            ->add('type', EntityType::class, array(
                'label' => "Type ",
                'class' => ArticleType::class,
                'query_builder' => function (EntityRepository $er) {
                    return $er->getFindAllQB();
                },
                'required' => false,
                'attr' => ['class' => 'form-control'],
                'label_attr' => array('class' => 'col-form-label'),
                'empty_data' => ''
            ))
            ->add('beginHDate', HDateType::class, array(
                'label' => 'Début',
                'label_attr' => array('class' => 'col-form-label hb-group-date'),
                'required' => false
            ))
            ->add('endHDate', HDateType::class, array(
                'label' => 'Fin',
                'label_attr' => array('class' => 'col-form-label hb-group-date'),
                'required' => false
        ));
    }


    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'allow_extra_fields' => true,
            'attr' => array('class'=>'form-inline hb-form')
        ));
    }

}