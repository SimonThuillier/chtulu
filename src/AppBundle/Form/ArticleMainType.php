<?php
namespace AppBundle\Form;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use AppBundle\DTO\ArticleMainDTO;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use AppBundle\Entity\ArticleType;
use AppBundle\Entity\ArticleSubType;
use Doctrine\ORM\EntityRepository;

class ArticleMainType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->setMethod('POST')
            ->add('title', TextType::class, array(
            'label' => 'Titre',
            'required' => true,
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
            ->add('subType', EntityType::class, array(
            'label' => "Sous-type ",
            'class' => ArticleSubType::class,
            'query_builder' => function (EntityRepository $er) {
                return $er->getFindAllQB();
            },
            'required' => true,
            'empty_data' => 'Selectionnez un sous-type'
        ))
            ->add('abstract', TextareaType::class, array(
            'label' => "Resumé "
        ))
            ->add('isBeginDateApprox', CheckboxType::class, array(
            'label' => "Date de début approximative ?",
            'required' => false,
            'attr' => array(
                'class' => 'checkbox icheck'
            )
        ))
            ->add('beginDate', DateType::class, $this->dateOptions('Date de début'))
            ->add('minBeginDate', DateType::class, $this->dateOptions('Date de début min'))
            ->add('maxBeginDate', DateType::class, $this->dateOptions('Date de début Max'))
            ->add('hasNotEndDate', CheckboxType::class, array(
            'label' => "Pas de date de fin",
            'required' => false,
            'attr' => array(
                'class' => 'checkbox icheck'
            )
        ))
            ->add('isEndDateApprox', CheckboxType::class, array(
            'label' => "Date de fin approximative ?",
            'required' => false,
            'attr' => array(
                'class' => 'checkbox icheck'
            )
        ))
            ->add('endDate', DateType::class, $this->dateOptions('Date de fin'))
            ->add('minEndDate', DateType::class, $this->dateOptions('Date de fin min'))
            ->add('maxEndDate', DateType::class, $this->dateOptions('Date de fin Max'))
            ->add('subEvents', TextareaType::class, array(
            'required' => false,
            'label' => 'sous-events'
        ))
            ->add('submit', SubmitType::class, array(
            'label' => 'Enregistrer'
        ));
        // ->add('content', TextareaType::class,array('required'=>false,'label'=>''))
    }

    private function dateOptions($label)
    {
        return array(
            'label' => $label,
            'widget' => 'single_text',
            'html5' => false,
            'format' => 'dd/MM/r',
            'attr' => [
                'class' => 'hts-date-input',
                'pattern' => "^(0?[1-9]|[1-2][0-9]|3[0-1])/(0?[1-9]|1[0-2])/(-?[1-9][0-9]*)$",
                'placeholder' => "JJ/MM/AAAA"
            ]
        );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => ArticleMainDTO::class,
            'allow_extra_fields' => true
        ));
    }
}
