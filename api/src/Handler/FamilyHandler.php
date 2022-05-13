<?php

namespace App\Handler;

use App\Entity\Family;
use App\Entity\Kid;
use App\Entity\Nurse;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectManager;

class FamilyHandler
{
    private ManagerRegistry $doctrine;
    private ObjectManager $entityManager;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
        $this->entityManager = $this->doctrine->getManager();
    }

    public function handleFamilyCreate(User $user)
    {
        $nurse = new Family();
        $nurse->setParent($user);

        $this->entityManager->persist($nurse);

        $this->entityManager->flush();
    }

    public function handleFamilyKidCreate(array $data, Nurse $nurse, Family $family)
    {
        $kid = (new Kid())
            ->setNurse($nurse)
            ->setFamily($family)
            ->setBirthday(new \DateTime($data['birthday']))
            ->setFirstname($data['firstname'])
            ->setLastname($data['lastname'])
            ->setActivated(false)
            ->setArchived(false);

        $this->entityManager->persist($kid);

        $this->entityManager->flush();
    }
}
