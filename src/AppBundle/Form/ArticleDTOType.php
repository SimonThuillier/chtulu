<?php
namespace AppBundle\Form;

use AppBundle\DTO\ArticleDTO;
use AppBundle\Entity\ArticleType;
use AppBundle\Repository\ArticleTypeRepository;
use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Debug\Exception\UndefinedMethodException;
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
            $groups = ['minimal'];
        }
        $groups = array_unique($groups);

        foreach($options['validation_groups'] as $group=>$subGroup){
            $function = 'build' . ucfirst($group) . 'Group';
            if(method_exists($this,$function)){
                $this->$function($builder,$options);
            }
        }
    }

    private function buildMinimalGroup(FormBuilderInterface $builder, array $options){

        $builder
            ->add('id', TextType::class)
            ->add('toDelete', CheckboxType::class)
            ->add('title', TextType::class)
            ->add('type', SimpleEntityType::class, array('data_class' => ArticleType::class)
            );
    }

    private function buildAbstractGroup(FormBuilderInterface $builder, array $options){

        $builder
        ->add('abstract', TextareaType::class);
    }

    private function buildDateGroup(FormBuilderInterface $builder, array $options){

        $builder
            ->add('beginHDate', HDateType::class)
            ->add('hasEndDate', CheckboxType::class)
            ->add('endHDate', HDateType::class);
    }

    private function buildDetailImageGroup(FormBuilderInterface $builder, array $options){
        $builder
            ->add('detailImageResource', HImageType::class);
    }

    private function buildHteRangeGroup(FormBuilderInterface $builder, array $options){

        $builder
            ->add('hteRange', HTimeExplorerType::class);
    }



    private function buildLinkGroup(FormBuilderInterface $builder, array $options){

        $builder
            ->add('y', TextType::class);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => ArticleDTO::class,
            'allow_extra_fields' => true,
            'csrf_protection' => false
        ));
    }
}
