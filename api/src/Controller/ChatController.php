<?php

namespace App\Controller;

use App\Entity\User;
use App\Handler\ChatHandler;
use App\Manager\ChatManager;
use App\Repository\ChatRepository;
use App\Repository\FamilyRepository;
use App\Service\PaginationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ChatController extends AbstractController
{
    private ChatHandler $chatHandler;
    private ChatManager $chatManager;
    private PaginationService $pagination;
    private ChatRepository $chatRepository;
    private FamilyRepository $familyRepository;

    public function __construct(ChatHandler $chatHandler, ChatManager $chatManager, PaginationService $pagination, ChatRepository $chatRepository, FamilyRepository $familyRepository)
    {
        $this->chatHandler = $chatHandler;
        $this->chatManager = $chatManager;
        $this->pagination = $pagination;
        $this->chatRepository = $chatRepository;
        $this->familyRepository = $familyRepository;
    }

    #[Route('/chat', name: 'app_chat')]
    public function index(Request $request): Response
    {
        $this->chatHandler->handleChatCreate($request);

        return $this->json([], Response::HTTP_CREATED);
    }

    #[Route('/chat/family', name: 'app_chat_family')]
    public function chatFamily(Request $request): Response
    {
        $this->chatHandler->handleCreateFamilyChat($request);

        return $this->json([], Response::HTTP_CREATED);
    }

    #[Route('/chat/{familyId}', name: 'app_chat_get_id', methods: 'GET')]
    public function getChatId(int $familyId): Response
    {
        $family = $this->familyRepository->findOneBy(['parent' => $familyId]);
        $chat = $this->chatRepository->findBy(['family' => $family->getId()]);

        if (!$chat) {
            $chat = null;
        }

        return $this->json($chat, Response::HTTP_OK, [], ['groups' => 'chat_list']);
    }

    #[Route('/chat/{user}/{role}', name: 'app_chat_nurse')]
    public function getChat(User $user, string $role, Request $request): Response
    {
        return $this->json(
            $this->pagination->getPagination(
                $request, $this->chatManager->getChat($user, $role), 4), Response::HTTP_OK
        );
    }
}
