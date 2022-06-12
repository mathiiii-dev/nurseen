<?php

namespace App\Handler;

use App\Entity\File;
use App\Repository\UserRepository;
use App\Service\UploadService;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\String\Slugger\SluggerInterface;

class FileHandler
{
    private ManagerRegistry $doctrine;
    private SluggerInterface $slugger;
    private UserRepository $userRepository;
    private ParameterBagInterface $bag;
    private UploadService $uploadService;

    public function __construct(
        ManagerRegistry       $doctrine,
        SluggerInterface      $slugger,
        UserRepository        $userRepository,
        ParameterBagInterface $bag,
        UploadService         $uploadService
    )
    {
        $this->doctrine = $doctrine;
        $this->slugger = $slugger;
        $this->userRepository = $userRepository;
        $this->bag = $bag;
        $this->uploadService = $uploadService;
    }

    public function handleFileCreate(Request $request)
    {
        $data = $request->toArray();
        $entityManager = $this->doctrine->getManager();
        $recipient = $this->userRepository->findOneBy(['id' => $data['recipient']]);
        $photo = (new File())
            ->setUrl($data['url'])
            ->setSender(
                $this->userRepository->findOneBy(['id' => $data['sender']])
            )->setRecipient($recipient)->setSendDate(new \DateTime())->setName($data['name']);

        $entityManager->persist($photo);
        $entityManager->flush();
    }
}
