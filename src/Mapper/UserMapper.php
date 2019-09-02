<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 27/03/18
 * Time: 23:57
 */

namespace App\Mapper;

use App\Entity\DTOMutableEntity;
use App\Entity\User;
use App\Factory\UserFactory;
use Psr\Log\LoggerInterface;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class UserMapper extends AbstractEntityMapper implements EntityMapperInterface
{
    /**
     * ArticleMapper constructor.
     *
     * @param ManagerRegistry $doctrine
     * @param UserFactory $entityFactory
     * @param LoggerInterface $logger
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(
        ManagerRegistry $doctrine,
        TokenStorageInterface $tokenStorage,
        LoggerInterface $logger,
        UserFactory $entityFactory
    )
    {
        $this->entityClassName = User::class;
        parent::__construct(
            $doctrine,
            $tokenStorage,
            $logger,
            $entityFactory
            );
    }

    /**
     * this method is here for compatibility but will never be used : security manager is in charge for creating users
     * @param DTOMutableEntity $entity
     * @param boolean $commit
     * @return User
     * @throws EntityMapperException
     */
    public function add(DTOMutableEntity $entity,$commit=true)
    {
        return $entity;
    }

    /**
     * @param DTOMutableEntity $entity
     * @param boolean $commit
     * @return User
     * @throws EntityMapperException
     */
    public function edit(DTOMutableEntity $entity,$commit=true)
    {
        $this->checkEdit($entity);
        /** @var User $user */
        $user = $this->defaultEdit($entity);
        $user->setLastUpdate(new \DateTime());

        if($commit) $this->getManager()->flush();
        return $user;
    }

    /**
     * @param int $id
     * @return string
     * @throws EntityMapperException
     */
    public function confirmDelete(int $id)
    {
        /** @var User $user */
        $user = $this->find($id);
        return "êtes vous sûr de vouloir supprimer l'utilisateur " . $user->getUsername() . " ?";
    }

    /**
     * @param integer $id
     * @param boolean $commit
     * @throws EntityMapperException
     */
    public function delete(int $id,$commit=true)
    {
        /** @var User $user */
        $user = $this->find($id);
        $user->setEnabled(false);
        $this->getManager()->flush();
    }

    /**
     * @inheritdoc
     */
    public function getFindAllQB()
    {
        return $this->repository->createQueryBuilder('o')
            ->select('o')
            ->leftJoin('o.detailImage','image')
            ->addSelect('image')
            ->orderBy('o.lastUpdate','DESC');
    }

    /**
     * produces a search part of the searchbag compliant with repository filter requirements
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