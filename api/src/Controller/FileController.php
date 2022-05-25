<?php

namespace App\Controller;

use App\Entity\User;
use App\Handler\FileHandler;
use App\Repository\FileRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FileController extends AbstractController
{
    private FileRepository $fileRepository;
    private FileHandler $fileHandler;

    public function __construct(FileRepository $fileRepository, FileHandler $fileHandler)
    {
        $this->fileRepository = $fileRepository;
        $this->fileHandler = $fileHandler;
    }

    #[Route('/file/{userId}/send', name: 'app_file_send')]
    public function send(Request $request): Response
    {
        $this->fileHandler->handleFileCreate($request);

        return $this->json([], Response::HTTP_CREATED);
    }

    #[Route('/file/{recipient}', name: 'app_file_get')]
    public function get(User $recipient): Response
    {
        $this->denyAccessUnlessGranted('owner', $recipient);
        $files = $this->fileRepository->findBy(['recipient' => $recipient->getId()]);

        return $this->json($files, Response::HTTP_CREATED, [], ['groups' => 'file']);
    }
}
