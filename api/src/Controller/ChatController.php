<?php

namespace App\Controller;

use App\Entity\User;
use App\Handler\ChatHandler;
use App\Manager\ChatManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ChatController extends AbstractController
{
    private ChatHandler $chatHandler;
    private ChatManager $chatManager;

    public function __construct(ChatHandler $chatHandler, ChatManager $chatManager)
    {
        $this->chatHandler = $chatHandler;
        $this->chatManager = $chatManager;
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

    #[Route('/chat/{user}/{role}', name: 'app_chat_nurse')]
    public function getChat(User $user, string $role): Response
    {
        return $this->json($this->chatManager->getChat($user, $role), Response::HTTP_OK);
    }
}
