<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 27/03/18
 * Time: 23:57
 */

namespace AppBundle\Mapper;

use AppBundle\DTO\EntityMutableDTO;
use AppBundle\Entity\Article;
use AppBundle\Factory\ArticleFactory;
use AppBundle\Factory\FactoryException;
use AppBundle\Form\DataTransformer\AbstractSimpleEntityTransformer;
use AppBundle\Form\DataTransformer\HDateToStringTransformer;
use AppBundle\Mediator\NullColleagueException;
use Psr\Log\LoggerInterface;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ArticleMapper extends AbstractEntityMapper implements EntityMapperInterface
{
    /**
     * @var AbstractSimpleEntityTransformer
     */
    private $articleTypeTransformer;
    /**
     * @var HDateToStringTransformer
     */
    private $hDateTransformer;




    /**
     * ArticleMapper constructor.
     *
     * @param ManagerRegistry $doctrine
     * @param ArticleFactory $entityFactory
     * @param LoggerInterface $logger
     * @param TokenStorageInterface $tokenStorage
     * @param AbstractSimpleEntityTransformer $articleTypeTransformer
     * @param HDateToStringTransformer $hDateTransformer
     */
    public function __construct(
        ManagerRegistry $doctrine,
        TokenStorageInterface $tokenStorage,
        LoggerInterface $logger,
        ArticleFactory $entityFactory,
        AbstractSimpleEntityTransformer $articleTypeTransformer,
        HDateToStringTransformer $hDateTransformer
    )
    {
        $this->entityClassName = Article::class;
        $this->articleTypeTransformer = $articleTypeTransformer;
        $this->hDateTransformer = $hDateTransformer;
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
     * @return Article
     * @throws FactoryException
     * @throws NullColleagueException
     * @throws EntityMapperException
     */
    public function add(EntityMutableDTO $dto,$commit=true)
    {
        $this->checkAdd($dto);
        /** @var Article $article */
        $article = $this->defaultAdd($dto);
        $article
            ->setEditionDate(new \DateTime())
            ->setEditionUser($this->getUser());
        if($commit){
            $this->getManager()->flush();
            $dto->setId($article->getId());
        }
        return $article;
    }

    /**
     * @param EntityMutableDTO $dto
     * @param boolean $commit
     * @return Article
     * @throws EntityMapperException
     * @throws NullColleagueException
     */
    public function edit(EntityMutableDTO $dto,$commit=true)
    {
        $this->checkEdit($dto);
        /** @var Article $article */
        $article = $this->defaultEdit($dto);
        $article
            ->setEditionDate(new \DateTime())
            ->setEditionUser($this->getUser());
        if($commit) $this->getManager()->flush();
        return $article;
    }

    /**
     * @param int $id
     * @return string
     * @throws EntityMapperException
     */
    public function confirmDelete(int $id)
    {
        /** @var Article $article */
        $article = $this->find($id);
        return "êtes vous sûr de vouloir supprimer l'article " . $article->getTitle() . " ?";
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
                case 'type':
                    $tSearch[$key] = $this->articleTypeTransformer->reverseTransform($value);
                    break;
                case 'beginHDate':
                    $tSearch[$key] = $this->hDateTransformer->reverseTransform($value);
                    break;
                case 'endHDate':
                    $tSearch[$key] = $this->hDateTransformer->reverseTransform($value);
                    break;
                default :
                    $tSearch[$key] = $value;
                    break;
            }
        }
        return $tSearch;
    }
}