<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 22/03/18
 * Time: 00:53
 */

namespace AppBundle\Form\DataTransformer;

use AppBundle\Entity\ArticleType;
use AppBundle\Entity\HResource;
use AppBundle\Factory\FactoryException;
use AppBundle\Factory\MediatorFactory;
use AppBundle\Mediator\NotAvailableGroupException;
use AppBundle\Mediator\ResourceDTOMediator;
use AppBundle\Serializer\ResourceDTONormalizer;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;
use Symfony\Component\Serializer\Encoder\JsonEncoder;


/**
 * Class HImageTransformer
 * @package AppBundle\Form\DataTransformer
 */
class ArticleTypeTransformer implements DataTransformerInterface
{
    /** @var ResourceDTONormalizer $normalizer */
    private $normalizer;
    /** @var JsonEncoder $encoder */
    private $encoder;
    /** @var ManagerRegistry $doctrine */
    private $doctrine;
    /** @var MediatorFactory $mediatorFactory */
    private $mediatorFactory;

    public function __construct(ResourceDTONormalizer $normalizer,
                                JsonEncoder $encoder,
                                ManagerRegistry $doctrine,
                                MediatorFactory $mediatorFactory)
    {
        $this->normalizer = $normalizer;
        $this->encoder = $encoder;
        $this->doctrine = $doctrine;
    }

    /**
     * @param  mixed|null $object
     * @return mixed|null
     */
    public function transform($object)
    {
// TODO
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

        return $this->doctrine->getRepository(ArticleType::class)->find(intval($payload));
    }

}