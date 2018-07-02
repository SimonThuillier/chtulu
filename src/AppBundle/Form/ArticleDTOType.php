<?php
namespace AppBundle\Form;

use AppBundle\DTO\ArticleDTO;
use AppBundle\Entity\ArticleType;
use AppBundle\Repository\ArticleTypeRepository;
use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;

class ArticleDTOType extends AbstractType
{
    private $test;

    /**
     * ArticleDTOType constructor.
     */
    public function __construct($test='ASC')
    {
        $this->test = $test;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->setMethod('POST');

        //var_dump($options['validation_groups']);
         $groups = $options['validation_groups'];
        if($groups === null || $groups ===[]) {
            $groups = ['minimal','abstract','date','detailImage','hteRange'];
        }
        $groups = array_unique($groups);

        foreach($options['validation_groups'] as $group){
            if($group === 'url') continue;
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
                    'class' => 'hb-hmaxlength',
                    'maxlength' => 60,
                    'size'=>60
                ),
                'label_attr' => array(
                    'placeholder' => 'Titre',
                    'class' => 'hb-group-minimal'
                )
            ))
            ->add('type', EntityType::class, array(
                'label' => "Type ",
                'class' => ArticleType::class,
                'query_builder' => function (ArticleTypeRepository $er) {
                    //return $er->getFindAllQB();
                    $blop = $er->getFindAllQB();
                    $blop->orderBy("o.label",$this->test);
                    return $blop;
                },
                'required' => true,
                'empty_data' => 'Selectionnez un type d\'article',
                'label_attr' => array('class' => 'hb-group-minimal')
            ));
    }

    private function buildAbstractGroup(FormBuilderInterface $builder, array $options){

        $builder
        ->add('abstract', TextareaType::class, array(
            'label' => "Resumé ",
            'label_attr' => array('class' => 'hb-group-abstract'),
            'required'=>false,
            'attr' => array(
                'class' => 'hb-hmaxlength hb-text',
                'resize' => 'vertical',
                'maxlength' => 2000
            )
        ));
    }

    private function buildDateGroup(FormBuilderInterface $builder, array $options){

        $builder
            ->add('beginHDate', HDateType::class, array(
                'label' => 'Date de début',
                'label_attr' => array('class' => 'hb-group-date'),
                'required' => true
            ))
            ->add('hasEndDate', CheckboxType::class, array(
                'label' => "A une date de fin",
                'required' => false,
                'attr' => array(
                    'class' => 'checkbox icheck hb-activer',
                    'style' => 'display:inline',
                    'data-target' => 'endHDate',
                    'hb-default-required' => true
                ),
                'label_attr' => array('class' => 'hb-group-date')
            ))
            ->add('endHDate', HDateType::class, array(
                'label' => 'Date de fin',
                'label_attr' => array('class' => 'hb-group-date'),
                'required' => true
            ));
    }

    private function buildDetailImageGroup(FormBuilderInterface $builder, array $options){
        $builder
            ->add('detailImageResource', HImageType::class, array(
                'label' => 'Image de présentation',
                'label_attr' => array('class' => 'hb-group-detailImage'),
                'required' => false
            ));
    }

    private function buildHteRangeGroup(FormBuilderInterface $builder, array $options){

        $builder
            ->add('hteRange', HTimeExplorerType::class, array(
                'required' => false,
                'label' => '',
                'label_attr' => array('class' => 'hb-group-hteRange')
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
            'attr' => array('class'=>'hb-form')
        ));
    }
}
