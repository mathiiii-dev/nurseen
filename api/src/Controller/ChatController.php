<?php

namespace App\Controller;

use App\Entity\Chat;
use App\Repository\ChatRepository;
use App\Repository\FamilyRepository;
use App\Repository\NurseRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ChatController extends AbstractController
{
    private NurseRepository $nurseRepository;
    private FamilyRepository $familyRepository;
    private ManagerRegistry $doctrine;
    private ChatRepository $chatRepository;

    public function __construct(NurseRepository $nurseRepository, FamilyRepository $familyRepository, ManagerRegistry $doctrine, ChatRepository $chatRepository)
    {
        $this->nurseRepository = $nurseRepository;
        $this->familyRepository = $familyRepository;
        $this->doctrine = $doctrine;
        $this->chatRepository = $chatRepository;
    }

    #[Route('/chat', name: 'app_chat')]
    public function index(Request $request): Response
    {
        $data = $request->toArray();
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $data['nurse']]);
        $family = $this->familyRepository->findOneBy(['parent' => $data['family']]);
        $chat = (new Chat())->setNurse($nurse)->setFamily($family);
        $em = $this->doctrine->getManager();
        $em->persist($chat);
        $em->flush();
        return $this->json([], Response::HTTP_CREATED);
    }

    #[Route('/chat/{nurseId}', name: 'app_chat_nurse')]
    public function getNurseChat(int $nurseId): Response
    {
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurseId]);
        $chat = $this->chatRepository->findBy(['nurse' => $nurse->getId()]);
        return $this->json($chat, Response::HTTP_CREATED, [], ['groups' => 'chat_list']);
    }
}
