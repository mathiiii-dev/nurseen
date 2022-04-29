<?php

namespace App\Controller;

use App\Entity\Chat;
use App\Repository\ChatRepository;
use App\Repository\FamilyRepository;
use App\Repository\MessageRepository;
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
    private MessageRepository $messageRepository;

    public function __construct(NurseRepository $nurseRepository, FamilyRepository $familyRepository, ManagerRegistry $doctrine, ChatRepository $chatRepository, MessageRepository $messageRepository)
    {
        $this->nurseRepository = $nurseRepository;
        $this->familyRepository = $familyRepository;
        $this->doctrine = $doctrine;
        $this->chatRepository = $chatRepository;
        $this->messageRepository = $messageRepository;
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
        $response = [];

        foreach ($chat as $key => $value) {
            $lastMessage = $this->messageRepository->findOneBy(['chat' => $value->getId()], ['id' => 'DESC']);
            array_push($response, [
                'chatId' => $value->getId(),
                'nurse' => [
                    'id' => $value->getNurse()->getId(),
                    'email' => $value->getNurse()->getNurse()->getEmail()
                ],
                'family' => [
                    'id' => $value->getFamily()->getId(),
                    'email' => $value->getFamily()->getParent()->getEmail()
                ],
                'lastMessage' => $lastMessage->getMessage()
            ]);
        }

        return $this->json($response, Response::HTTP_CREATED);
    }
}
