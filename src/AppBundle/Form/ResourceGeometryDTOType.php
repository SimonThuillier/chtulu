<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 21/03/18
 * Time: 23:02
 */

namespace AppBundle\Form;

use AppBundle\DTO\ResourceGeometryDTO;
use Symfony\Component\Form\Extension\Core\Type\FileType;
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
            ->add('comment', FileType::class, array(
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
            'attr' => array(
                'target' => 'resource_post_upload_resource',
            ),
            'allow_extra_fields' => true
        ));
    }
}