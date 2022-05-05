<?php

namespace App\Controller;

use App\Entity\File;
use App\Repository\FileRepository;
use App\Repository\UserRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class FileController extends AbstractController
{
    private SluggerInterface $slugger;
    private UserRepository $userRepository;
    private ManagerRegistry $doctrine;
    private FileRepository $fileRepository;

    public function __construct(SluggerInterface $slugger, UserRepository $userRepository, ManagerRegistry $doctrine, FileRepository $fileRepository)
    {
        $this->slugger = $slugger;
        $this->userRepository = $userRepository;
        $this->doctrine = $doctrine;
        $this->fileRepository = $fileRepository;
    }

    #[Route('/file/{userId}/send', name: 'app_file_send')]
    public function send(Request $request): Response
    {
        $file = $request->files->get('file');
        $entityManager = $this->doctrine->getManager();
        $safeFilename = $this->slugger->slug($file->getClientOriginalName());
        $fileName = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();
        $recipient = $this->userRepository->findOneBy(['id' => $request->get('recipient')]);
        $photo = (new File())->setUrl($fileName)->setSender($this->userRepository->findOneBy(['id' => $request->get('sender')]))->setRecipient($recipient);
        $entityManager->persist($photo);
        $entityManager->flush();

        try {
            $file->move($this->getParameter('file_directory') . '/' . $recipient->getId(), $fileName);
        } catch (FileException $e) {
            throw new \Exception($e->getMessage());
        }
        return $this->json([], Response::HTTP_CREATED);
    }

    #[Route('/file/{recipientId}', name: 'app_file_get')]
    public function get(int $recipientId): Response
    {
        $files = $this->fileRepository->findBy(['recipient' => $recipientId]);
        return $this->json($files, Response::HTTP_CREATED, [], ['groups' => 'file']);
    }
}
