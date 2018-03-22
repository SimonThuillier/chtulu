<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 21/03/18
 * Time: 23:02
 */

namespace AppBundle\Form\Type;

use AppBundle\Form\DataTransformer\HDateToStringTransformer;
use AppBundle\Utils\HDate;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class HDateType extends AbstractType
{
    private $transformer;

    public function __construct(HDateToStringTransformer $transformer)
    {
        $this->transformer = $transformer;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->addModelTransformer($this->transformer);
    }



    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'attr' => array(
                'class' => 'hb-hdatepicker',
            ),
            //'data_class' => HDate::class,
            'allow_extra_fields' => false
        ));
    }






    public function getParent()
    {
        return TextType::class;
    }
}