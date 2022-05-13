<?php

namespace App\Handler;

use App\Entity\Gallery;
use App\Entity\Nurse;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Filesystem\Filesystem;

class GalleryHandler
{
    private ManagerRegistry $doctrine;
    private Filesystem $filesystem;
    private ParameterBagInterface $bag;

    public function __construct(ManagerRegistry $doctrine, Filesystem $filesystem, ParameterBagInterface $bag)
    {
        $this->doctrine = $doctrine;
        $this->filesystem = $filesystem;
        $this->bag = $bag;
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
        $this->filesystem->remove($this->bag->get('gallery_directory').'/'.$gallery->getNurse()->getNurse()->getId().'/'.$gallery->getUrl());
        $entityManager->remove($gallery);
        $entityManager->flush();
    }
}
