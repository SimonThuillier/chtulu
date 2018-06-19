<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 21/03/18
 * Time: 23:02
 */

namespace AppBundle\Form;

use AppBundle\Form\DataTransformer\HImageTransformer;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class HFileUploadType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->setMethod('POST');

        $builder
            ->add('file', FileType::class, array(
                'label' => 'Fichier à charger',
                'required' => true
            ))
            ->add('name', TextType::class, array(
                'label' => 'Nom du fichier',
                'required' => false,
                'attr' => array(
                    'maxlength' => 100
                )
            ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'attr' => array(
                'target' => 'resource_post_upload_resource',
            ),
            'allow_extra_fields' => true
        ));
    }
}