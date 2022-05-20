<?php

namespace App\Handler;

use App\Entity\Chat;
use App\Entity\Message;
use App\Entity\User;
use App\Service\MercureService;
use DateTime;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class MessageHandler
{
    private ValidatorInterface $validator;
    private ManagerRegistry $doctrine;
    private MercureService $mercure;

    public function __construct(ValidatorInterface $validator, ManagerRegistry $doctrine, MercureService $mercure)
    {
        $this->validator = $validator;
        $this->doctrine = $doctrine;
        $this->mercure = $mercure;
    }

    /**
     * @throws Exception
     */
    public function handleMessageCreate(User $user, array $data, Chat $chat): bool
    {
        $message = (new Message())
            ->setUser($user)
            ->setMessage($data['message'])
            ->setChat($chat)
            ->setSendDate(new DateTime($data['sendDate']));

        $errors = $this->validator->validate($message);

        if (0 === count($errors)) {
            $em = $this->doctrine->getManager();
            $em->persist($message);
            $em->flush();
            $this->mercure->update(
                'http://localhost:8010/proxy/api/message/'.$chat->getId(),
                json_encode([
                    'data' => $message->getMessage(),
                    'id' => $message->getId(),
                    'sendDate' => $message->getSendDate()->format("Y-m-d\TH:i:s+00:00"),
                    'userId' => $user->getId(),
                    'lastname' => $user->getLastname(),
                    'firstname' => $user->getFirstname(),
                ])
            );

            return true;
        }

        return false;
    }
}
