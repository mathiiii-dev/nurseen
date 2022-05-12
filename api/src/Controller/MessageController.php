<?php

namespace App\Controller;

use App\Entity\Message;
use App\Repository\ChatRepository;
use App\Repository\MessageRepository;
use App\Repository\UserRepository;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class MessageController extends AbstractController
{
    private MessageRepository $messageRepository;
    private MessageBusInterface $bus;
    private SerializerInterface $serializer;
    private ValidatorInterface $validator;
    private ManagerRegistry $doctrine;
    private UserRepository $userRepository;
    private ChatRepository $chatRepository;

    public function __construct(
        ChatRepository $chatRepository,
        UserRepository $userRepository,
        MessageRepository $messageRepository,
        MessageBusInterface $bus,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        ManagerRegistry $doctrine
    ) {
        $this->messageRepository = $messageRepository;
        $this->bus = $bus;
        $this->serializer = $serializer;
        $this->validator = $validator;
        $this->doctrine = $doctrine;
        $this->userRepository = $userRepository;
        $this->chatRepository = $chatRepository;
    }

    #[Route('/message/{chatId}', name: 'app_message_get', methods: 'GET')]
    public function get(int $chatId): Response
    {
        $messages = $this->messageRepository->findBy(['chat' => $chatId]);

        return $this->json($messages, Response::HTTP_OK, [], ['groups' => 'chat']);
    }

    /**
     * @throws Exception
     */
    #[Route('/message/{chatId}', name: 'app_message_post', methods: 'POST')]
    public function post(Request $request, int $chatId): Response
    {
        $data = $request->toArray();
        $user = $this->userRepository->findOneBy(['id' => $data['user']]);
        $chat = $this->chatRepository->findOneBy(['id' => $chatId]);
        $message = (new Message())->setUser($user)->setMessage($data['message'])->setChat($chat)->setSendDate(new \DateTime($data['sendDate']));
        $errors = $this->validator->validate($message);
        if (0 === count($errors)) {
            $em = $this->doctrine->getManager();
            $em->persist($message);
            $em->flush();
            $update = new Update(
                'http://localhost:8010/proxy/api/message/'.$chatId,
                json_encode([
                    'data' => $message->getMessage(),
                    'id' => $message->getId(),
                    'sendDate' => $message->getSendDate()->format("Y-m-d\TH:i:s+00:00"),
                    'lastname' => $user->getLastname(),
                    'firstname' => $user->getFirstname(),
                ])
            );
            $this->bus->dispatch($update);

            return new Response(Response::HTTP_OK);
        }

        return new Response(Response::HTTP_BAD_REQUEST);
    }

    #[Route('/message/ping', name: 'app_message_ping', methods: 'POST')]
    public function ping(): Response
    {
        $update = new Update(
            'http://localhost:8010/proxy/api/message',
            json_encode(['data' => 'ping'])
        );
        $this->bus->dispatch($update);

        return new Response(Response::HTTP_OK);
    }
}
