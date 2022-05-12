<?php

namespace App\Handler;

use App\Entity\Kid;
use App\Entity\Note;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;

class NoteHandler
{
    private ManagerRegistry $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function handleCreateNote(Request $request, Kid $kid): void
    {
        $data = $request->toArray();
        $note = (new Note())->setKid($kid)->setNote($data['note'])->setDate(new \DateTime());
        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($note);
        $entityManager->flush();
    }

    public function handleDeleteNote(Note $note): void
    {
        $entityManager = $this->doctrine->getManager();

        $entityManager->remove($note);
        $entityManager->flush();
    }

    public function handleEditNote(Request $request, Note $note): void
    {
        $data = $request->toArray();
        $note->setNote($data['note']);
        $entityManager = $this->doctrine->getManager();
        $entityManager->flush();
    }
}
