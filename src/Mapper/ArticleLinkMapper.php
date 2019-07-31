<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 27/03/18
 * Time: 23:57
 */

namespace App\Mapper;

use App\DTO\EntityMutableDTO;
use App\Entity\Article;
use App\Entity\ArticleLink;
use App\Entity\ArticleType;
use App\Factory\ArticleFactory;
use App\Factory\FactoryException;
use App\Mediator\NullColleagueException;
use App\Serializer\HDateNormalizer;
use App\Serializer\SimpleEntityNormalizer;
use App\Utils\HDate;
use Psr\Log\LoggerInterface;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ArticleLinkMapper extends AbstractEntityMapper implements EntityMapperInterface
{
    /**
     * ArticleMapper constructor.
     *
     * @param ManagerRegistry $doctrine
     * @param ArticleFactory $entityFactory
     * @param LoggerInterface $logger
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(
        ManagerRegistry $doctrine,
        TokenStorageInterface $tokenStorage,
        LoggerInterface $logger,
        ArticleFactory $entityFactory
    )
    {
        $this->entityClassName = Article::class;
        parent::__construct(
            $doctrine,
            $tokenStorage,
            $logger,
            $entityFactory
            );
    }

    /**
     * @param EntityMutableDTO $dto
     * @param boolean $commit
     * @return ArticleLink
     * @throws FactoryException
     * @throws NullColleagueException
     * @throws EntityMapperException
     */
    public function add(EntityMutableDTO $dto,$commit=true)
    {
        $this->checkAdd($dto);
        /** @var ArticleLink $articleLink */
        $articleLink = $this->defaultAdd($dto);
        $articleLink
            ->setEditionDate(new \DateTime())
            ->setEditionUser($this->getUser());
        if($commit){
            $this->getManager()->flush();
            $dto->setId($articleLink->getId());
        }
        return $articleLink;
    }

    /**
     * @param EntityMutableDTO $dto
     * @param boolean $commit
     * @return ArticleLink
     * @throws EntityMapperException
     * @throws NullColleagueException
     */
    public function edit(EntityMutableDTO $dto,$commit=true)
    {
        $this->checkEdit($dto);
        /** @var ArticleLink $articleLink */
        $articleLink = $this->defaultEdit($dto);
        $articleLink
            ->setEditionDate(new \DateTime())
            ->setEditionUser($this->getUser());
        if($commit) $this->getManager()->flush();
        return $articleLink;
    }

    /**
     * @param int $id
     * @return string
     * @throws EntityMapperException
     */
    public function confirmDelete(int $id)
    {
        /** @var ArticleLink $articleLink */
        $articleLink = $this->find($id);
        return "êtes vous sûr de vouloir supprimer l'article Link " . $articleLink->getId() . " ?";
    }

    /**
     * @param integer $id
     * @param boolean $commit
     * @throws EntityMapperException
     */
    public function delete(int $id,$commit=true)
    {
        $this->checkDelete($id);
        $this->defaultDelete($id);
        $this->getManager()->flush();
    }

    /**
     * @inheritdoc
     */
    public function getFindAllQB()
    {
        return $this->repository->createQueryBuilder('o')
            ->select('o')
            ->orderBy('o.editionDate','DESC');
    }

    /**
     * produces a search part of the searchbag complient with repository filter requirements
     * @param $search
     * @return mixed
     */
    protected function getTransformedSearch($search){
        if ($search === null || !is_array($search)) return [];
        $tSearch = [];
        foreach((array)($search) as $key => $value){
            switch($key){
                default :
                    $tSearch[$key] = $value;
                    break;
            }
        }
        return $tSearch;
    }
}