<?php

namespace App\Handler;

use App\Entity\Kid;
use Doctrine\Persistence\ManagerRegistry;

class KidHandler
{
    private ManagerRegistry $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function handleKidActivation(Kid $kid): void
    {
        $activated = $kid->getActivated();
        $kid->setActivated(!$activated);
        $entityManager = $this->doctrine->getManager();
        $entityManager->flush();
    }

    public function handleKidArchivation(Kid $kid): void
    {
        $kid->setArchived(true);
        $entityManager = $this->doctrine->getManager();
        $entityManager->flush();
    }
}
