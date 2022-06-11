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

    public function handleGalleryCreate(array $data, Nurse $nurse): void
    {
        $entityManager = $this->doctrine->getManager();

        foreach ($data as $image) {
            $photo = (new Gallery())->setUrl($image['public_id'])->setNurse($nurse);
            $entityManager->persist($photo);
            $entityManager->flush();
        }
    }

    public function handleGalleryDelete(Gallery $gallery): void
    {
        $entityManager = $this->doctrine->getManager();
        $entityManager->remove($gallery);
        $entityManager->flush();
    }
}
