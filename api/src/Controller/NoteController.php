<?php

namespace App\Controller;

use App\Handler\NoteHandler;
use App\Manager\KidManager;
use App\Repository\NoteRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class NoteController extends AbstractController
{

    private NoteHandler $noteHandler;
    private KidManager $kidManager;
    private NoteRepository $noteRepository;

    public function __construct(NoteHandler $noteHandler, KidManager $kidManager, NoteRepository $noteRepository)
    {
        $this->noteHandler = $noteHandler;
        $this->kidManager = $kidManager;
        $this->noteRepository = $noteRepository;
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/note/kid/{kidId}', name: 'app_note', methods: 'POST')]
    public function create(Request $request, int $kidId): Response
    {
        $kid = $this->kidManager->getKid($kidId);
        $this->denyAccessUnlessGranted('owner', $kid);
        $this->noteHandler->handleCreateNote($request, $kid);
        return $this->json([], Response::HTTP_CREATED);
    }

    #[IsGranted('IS_AUTHENTICATED_FULLY', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/note/kid/{kidId}/all', name: 'app_note_all', methods: 'GET')]
    public function getAll(int $kidId): Response
    {
        $kid = $this->kidManager->getKid($kidId);
        $this->denyAccessUnlessGranted('owner', $kid);
        $notes = $this->noteRepository->findBy(['kid' => $kid->getId()]);
        return $this->json($notes, Response::HTTP_OK, [], ['groups' => 'note_list']);
    }

    #[IsGranted('ROLE_PARENT', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/note/{noteId}', name: 'app_note_get_one', methods: 'GET')]
    public function getOne(int $noteId): Response
    {
        $note = $this->noteRepository->findOneBy(['id' => $noteId]);
        return $this->json($note, Response::HTTP_OK, [], ['groups' => 'note_list']);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/note/{noteId}', name: 'app_note_delete', methods: 'DELETE')]
    public function delete(int $noteId): Response
    {
        $note = $this->noteRepository->findOneBy(['id' => $noteId]);
        $this->denyAccessUnlessGranted('owner', $note->getKid());
        $this->noteHandler->handleDeleteNote($note);
        return $this->json([], Response::HTTP_NO_CONTENT);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/note/{noteId}/edit', name: 'app_note_edit', methods: 'PATCH')]
    public function edit(Request $request, int $noteId): Response
    {
        $note = $this->noteRepository->findOneBy(['id' => $noteId]);
        $this->denyAccessUnlessGranted('owner', $note->getKid());
        $this->noteHandler->handleEditNote($request, $note);
        return $this->json([], Response::HTTP_NO_CONTENT);
    }
}
