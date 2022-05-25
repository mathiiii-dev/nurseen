<?php

namespace App\Repository;

use App\Entity\Calendar;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Calendar|null find($id, $lockMode = null, $lockVersion = null)
 * @method Calendar|null findOneBy(array $criteria, array $orderBy = null)
 * @method Calendar[]    findAll()
 * @method Calendar[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CalendarRepository extends ServiceEntityRepository
{
    private Connection $connection;

    public function __construct(ManagerRegistry $registry, Connection $connection)
    {
        parent::__construct($registry, Calendar::class);
        $this->connection = $connection;
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(Calendar $entity, bool $flush = true): void
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
    public function remove(Calendar $entity, bool $flush = true): void
    {
        $this->_em->remove($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }


    public function getCalendarByNurse(int $nurseId): array
    {
        $sql = '
                select c.*, k.firstname, k.lastname, k.color from kid k 
                inner join calendar c on c.kid_id = k.id
                where k.family_id = '.$nurseId.'
                ';

        return $this->connection->fetchAllAssociative($sql);
    }

    public function getCalendarByFamily(int $familyId): array
    {
        $sql = '
            select * from calendar as c
            inner join kid k on k.id = c.kid_id and k.family_id = '.$familyId.'
                ';

        return $this->connection->fetchAllAssociative($sql);
    }
}
