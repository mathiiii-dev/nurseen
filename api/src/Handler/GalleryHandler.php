<?php

namespace App\Handler;

use App\Entity\Gallery;
use App\Entity\Nurse;
use Doctrine\Persistence\ManagerRegistry;

class GalleryHandler
{
    private ManagerRegistry $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function handleGalleryCreate(string $fileName, Nurse $nurse): void
    {
        $entityManager = $this->doctrine->getManager();
        $photo = (new Gallery())->setUrl($fileName)->setNurse($nurse);
        $entityManager->persist($photo);
        $entityManager->flush();
    }

    public function handleGalleryDelete(Gallery $gallery): void
    {
        $entityManager = $this->doctrine->getManager();
        $entityManager->remove($gallery);
        $entityManager->flush();
    }
}
