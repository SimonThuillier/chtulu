<?php
namespace AppBundle\Factory;

use AppBundle\DTO\ArticleDTO;
use AppBundle\Entity\DateType;
use AppBundle\Utils\HDate;
use Symfony\Bridge\Doctrine\ManagerRegistry;

class ArticleDTOFactory extends DTOFactory
{
    /**
     * ArticleDTOFactory constructor.
     * @param ManagerRegistry $doctrine
     */
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->productClassName = ArticleDTO::class;
        parent::__construct($doctrine);
    }

    protected function setDefaultData()
    {
        /** @var ArticleDTO $articleDTO */
        $articleDTO = $this->product;
        $articleDTO->setHasEndDate(true);

        $hteRange = new HDate();
        $hteRange->setType($this->doctrine->getRepository(DateType::class)->find(DateType::BOUNDED))
            ->setBeginDate(\DateTime::createFromFormat('Y-m-d', '2000-01-01'))
            ->setEndDate(new \DateTime());

        $articleDTO->setHteRange($hteRange);
    }
}