<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 00:53
 */

namespace App\Form\DataTransformer;

use App\Entity\HResource;
use App\Factory\FactoryException;
use App\Factory\MediatorFactory;
use App\Mediator\NotAvailableGroupException;
use App\Mediator\ResourceDTOMediator;
use App\Serializer\ResourceDTONormalizer;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;
use Symfony\Component\Serializer\Encoder\EncoderInterface;


/**
 * Class HImageTransformer
 * @package App\Form\DataTransformer
 */
class HImageTransformer implements DataTransformerInterface
{
    /** @var ResourceDTONormalizer $normalizer */
    private $normalizer;
    /** @var EncoderInterface; $encoder */
    private $encoder;
    /** @var ManagerRegistry $doctrine */
    private $doctrine;
    /** @var MediatorFactory $mediatorFactory */
    private $mediatorFactory;

    public function __construct(ResourceDTONormalizer $normalizer,
                                EncoderInterface $encoder,
                                ManagerRegistry $doctrine,
                                MediatorFactory $mediatorFactory)
    {
        $this->normalizer = $normalizer;
        $this->encoder = $encoder;
        $this->doctrine = $doctrine;
        $this->mediatorFactory = $mediatorFactory;
    }

    /**
     * @param  mixed|null $object
     * @return mixed|null
     * @throws TransformationFailedException
     * @throws NotAvailableGroupException
     */
    public function transform($object)
    {
        if (null === $object) return '';
        $normalization = $this->normalizer->normalize($object,
            ["minimal","activeVersion"=>["minimal","urlDetailThumbnail","urlMini"]]);
        return $this->encoder->encode($normalization,'json');
    }

    /**
     * @param  mixed|null $payload
     * @return mixed|null
     * @throws TransformationFailedException
     * @throws FactoryException
     * @throws NotAvailableGroupException
     * @throws \Exception
     */
    public function reverseTransform($payload)
    {
        if (null === $payload || $payload === "") return null;
        $arrayPayload = $this->encoder->decode($payload,'json');
        if(! array_key_exists("id",$arrayPayload)) return null;
        $id = intval($arrayPayload["id"]);
        $hResource = $this->doctrine->getRepository(HResource::class)->find($id);
        if($hResource === null) return null;

        $resourceMediator = $this->mediatorFactory->create(ResourceDTOMediator::class,$hResource);
        $resourceMediator->mapDTOGroups(["minimal","activeVersion"=>["minimal"]]);
        return $resourceMediator->getDTO();
    }

}