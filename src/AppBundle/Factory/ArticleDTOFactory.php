<?php
namespace AppBundle\Factory;

use AppBundle\DTO\ArticleDTO;
use AppBundle\Entity\DateType;
use AppBundle\Utils\HDate;
//use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ArticleDTOFactory extends AbstractDTOFactory
{
    /**
     * @inheritdoc
     */
    public function __construct(ManagerRegistry $doctrine,TokenStorageInterface $tokenStorage)
    {
        $this->productClassName = ArticleDTO::class;
        parent::__construct($doctrine,$tokenStorage);
    }

    /**
     * @inheritdoc
     */
    protected function setDefaultData($product)
    {
        /** @var ArticleDTO $articleDTO */
        $articleDTO = $product;
        $articleDTO->setHasEndDate(true);

        $hteRange = new HDate();
        $hteRange->setType($this->doctrine->getRepository(DateType::class)->find(DateType::BOUNDED))
            ->setBeginDate(\DateTime::createFromFormat('Y-m-d', '2000-01-01'))
            ->setEndDate(new \DateTime());

        $articleDTO->setHteRange($hteRange);
    }
}