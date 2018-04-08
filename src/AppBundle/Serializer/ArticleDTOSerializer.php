<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 07/04/18
 * Time: 20:05
 */

namespace AppBundle\Serializer;


use AppBundle\DTO\ArticleDTO;
use Doctrine\Common\Annotations\AnnotationReader;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\PropertyNormalizer;
use Symfony\Component\Serializer\Serializer;


class ArticleDTOSerializer extends AbstractHSerializer
{
    /**
     * @param ManagerRegistry $doctrine
     * @param HDateSerializer $hDateSerializer
     */
    public function __construct(ManagerRegistry $doctrine,HDateSerializer $hDateSerializer)
    {
        parent::__construct($doctrine);
        $encoders = array(new JsonEncoder());
        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $normalizers = array(
            $hDateSerializer,
            new PropertyNormalizer($classMetadataFactory),
            new ObjectNormalizer());
        $this->serializer = new Serializer($normalizers,$encoders);
        $this->classNames = [ArticleDTO::class];
        $this->mandatoryKeys = ["title"];
    }

    /**
     * @param ArticleDTO $object
     * @param array|null $groups
     * @return array
     * @throws SerializationException
     */
    public function normalize($object,$groups=null)
    {
        $this->preCheckNormalize($object);
        try{
            $normalization = $this->serializer
                ->normalize($object, null, array('groups' => $groups));
        }
        catch(\Exception $e){
            throw new SerializationException("Error while serializing object of class " .
                get_class($object) . " :  " . $e->getMessage());
        }
        return $normalization;
    }

    /**
     * @param array $normalizedPayload
     * @param mixed|null $object
     * @return ArticleDTO
     * @throws DeserializationException
     */
    public function denormalize($normalizedPayload,$object=null)
    {
        $this->preCheckDenormalize($normalizedPayload);
        /*try{
            $normalizedPayload["beginDate"] = DateHelper::createFromJson($normalizedPayload["beginDate"]);
            $normalizedPayload["endDate"] = DateHelper::createFromJson($normalizedPayload["endDate"]);
            $normalizedPayload["type"] = $this->doctrine->getRepository(DateType::class)
                ->find(intval($normalizedPayload["type"]));
        }
        catch(\Exception $e){
            throw new DeserializationException("Invalid argument for transformation while deserializing to " .
                reset($classNames) . " :  " . $e->getMessage());
        }

        try{
            if($object !== null){
                $this->mainFactory
                    ->setObject($object)
                    ->setData($normalizedPayload["type"],$normalizedPayload["beginDate"], ["endDate"])
                    ->getObject();
            }
            else{
                $object = $this->mainFactory->create($normalizedPayload["type"],$normalizedPayload["beginDate"],
                    $normalizedPayload["endDate"]);
            }
        }
        catch(\Exception $e){
            throw new DeserializationException("Error while creating new '" .
                reset($classNames) . "' object :  " . $e->getMessage());
        }*/
        return $object;
    }
}