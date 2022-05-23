<?php

namespace App\Repository;

use App\Entity\Kid;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Kid|null find($id, $lockMode = null, $lockVersion = null)
 * @method Kid|null findOneBy(array $criteria, array $orderBy = null)
 * @method Kid[]    findAll()
 * @method Kid[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class KidRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Kid::class);
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(Kid $entity, bool $flush = true): void
    {
        $this->_em->persist($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function remove(Kid $entity, bool $flush = true): void
    {
        $this->_em->remove($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    public function findKidsByNurseNonArchived(int $nurse): array
    {
        return $this->createQueryBuilder('k')
            ->andWhere('k.archived = false')
            ->andWhere('k.nurse = :nurse')
            ->setParameter('nurse', $nurse)
            ->getQuery()
            ->getResult()
        ;
    }
}
