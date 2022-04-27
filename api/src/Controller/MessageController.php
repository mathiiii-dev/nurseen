<?php

namespace App\Controller;

use App\Entity\Message;
use App\Repository\MessageRepository;
use App\Repository\UserRepository;
use Doctrine\Persistence\ManagerRegistry;
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

    public function __construct(UserRepository $userRepository, MessageRepository $messageRepository, MessageBusInterface $bus, SerializerInterface $serializer, ValidatorInterface $validator, ManagerRegistry $doctrine)
    {
        $this->messageRepository = $messageRepository;
        $this->bus = $bus;
        $this->serializer = $serializer;
        $this->validator = $validator;
        $this->doctrine = $doctrine;
        $this->userRepository = $userRepository;
    }

    #[Route('/message', name: 'app_message_get', methods: 'GET')]
    public function get(): Response
    {
        $messages = $this->messageRepository->findAll();

        return $this->json($messages, Response::HTTP_OK, [], ['groups' => 'chat']);
    }

    #[Route('/message', name: 'app_message_post', methods: 'POST')]
    public function post(Request $request): Response
    {
        $data = $request->toArray();
        $user = $this->userRepository->findOneBy(['id' => $data['user']]);
        $message = (new Message())->setUser($user)->setMessage($data['message']);
        $errors = $this->validator->validate($message);
        if(count($errors) === 0){
            $em = $this->doctrine->getManager();
            $em->persist($message);
            $em->flush();
            $update = new Update(
                'http://localhost:8010/proxy/api/message',
                $this->serializer->serialize($message, 'json', ['groups' => 'kid_list'])
            );
            dd($update);
            $this->bus->dispatch($update);
            return new Response(Response::HTTP_OK);
        }
        return new Response(Response::HTTP_BAD_REQUEST);
    }

    #[Route('/message/ping', name: 'app_message_ping', methods: 'POST')]
    public function ping(): Response
    {
        $update = new Update(
            'http://localhost:8010/proxy/api/message/ping',
            json_encode(['data' => 'ping'])
        );
        $this->bus->dispatch($update);
        return new Response(Response::HTTP_OK);
    }
}
