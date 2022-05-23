<?php

namespace App\Handler;

use App\Entity\Nurse;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;

class NurseHandler
{
    private ManagerRegistry $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function handleNurseCreate(User $user): void
    {
        $entityManager = $this->doctrine->getManager();

        $nurse = new Nurse();
        $nurse->setNurse($user);

        $entityManager->persist($nurse);

        $entityManager->flush();
    }
}
