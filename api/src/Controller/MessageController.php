<?php

namespace App\Controller;

use App\Entity\Chat;
use App\Handler\MessageHandler;
use App\Repository\MessageRepository;
use App\Repository\UserRepository;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MessageController extends AbstractController
{
    private MessageRepository $messageRepository;
    private UserRepository $userRepository;
    private MessageHandler $messageHandler;

    public function __construct(
        UserRepository $userRepository,
        MessageRepository $messageRepository,
        MessageHandler $messageHandler
    ) {
        $this->messageRepository = $messageRepository;
        $this->userRepository = $userRepository;
        $this->messageHandler = $messageHandler;
    }

    #[Route('/message/{chat}', name: 'app_message_get', methods: 'GET')]
    public function get(Chat $chat): Response
    {
        $this->denyAccessUnlessGranted('owner', $chat);
        $messages = $this->messageRepository->findBy(['chat' => $chat->getId()]);

        return $this->json($messages, Response::HTTP_OK, [], ['groups' => 'chat']);
    }

    /**
     * @throws Exception
     */
    #[Route('/message/{chat}', name: 'app_message_post', methods: 'POST')]
    public function post(Request $request, Chat $chat): Response
    {
        $this->denyAccessUnlessGranted('owner', $chat);
        $data = $request->toArray();
        $user = $this->userRepository->findOneBy(['id' => $data['user']]);

        $update = $this->messageHandler->handleMessageCreate($user, $data, $chat);

        if ($update) {
            return $this->json([], Response::HTTP_OK);
        }

        return $this->json([], Response::HTTP_BAD_REQUEST);
    }
}
