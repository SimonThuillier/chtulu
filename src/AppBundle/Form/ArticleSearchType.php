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
            ->add('title', TextType::class, array(
                'label' => 'Titre',
                'required' => false,
                'attr' => ['class' => 'form-control form-control-sm mb-2 mr-sm-2 mb-sm-0'],
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
                'attr' => ['class' => 'form-control form-control-sm mb-2 mr-sm-2 mb-sm-0'],
                'empty_data' => ''
            ))
            ->add('beginHDate', HDateType::class, array(
                'label' => 'Date de début'
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