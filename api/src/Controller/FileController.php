<?php

namespace App\Controller;

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

    #[Route('/file/{recipientId}', name: 'app_file_get')]
    public function get(int $recipientId): Response
    {
        $files = $this->fileRepository->findBy(['recipient' => $recipientId]);

        return $this->json($files, Response::HTTP_CREATED, [], ['groups' => 'file']);
    }
}
