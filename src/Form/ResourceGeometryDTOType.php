<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 21/03/18
 * Time: 23:02
 */

namespace App\Form;

use App\DTO\ResourceGeometryDTO;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ResourceGeometryDTOType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->setMethod('POST');

        $builder
            ->add('id', NumberType::class, array(
                'required' => true
            ))
            ->add('comment', TextType::class, array(
                'required' => true
            ))
            ->add('targetGeometry', GeoJsonType::class, array(
                'required' => true
            ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => ResourceGeometryDTO::class,
            'allow_extra_fields' => true,
            'csrf_protection' => false
        ));
    }
}