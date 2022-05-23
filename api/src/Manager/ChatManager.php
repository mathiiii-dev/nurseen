<?php

namespace App\Manager;

use App\Entity\User;
use App\Repository\ChatRepository;
use App\Repository\FamilyRepository;
use App\Repository\MessageRepository;
use App\Repository\NurseRepository;

class ChatManager
{
    private NurseRepository $nurseRepository;
    private ChatRepository $chatRepository;
    private MessageRepository $messageRepository;
    private FamilyRepository $familyRepository;

    public function __construct(NurseRepository $nurseRepository, ChatRepository $chatRepository, MessageRepository $messageRepository, FamilyRepository $familyRepository)
    {
        $this->nurseRepository = $nurseRepository;
        $this->chatRepository = $chatRepository;
        $this->messageRepository = $messageRepository;
        $this->familyRepository = $familyRepository;
    }

    public function getChat(User $user, string $role): array
    {
        $chat = null;
        if ('nurse' === $role) {
            $nurse = $this->nurseRepository->findOneBy(['nurse' => $user->getId()]);
            $chat = $this->chatRepository->findBy(['nurse' => $nurse->getId()]);
        }

        if ('family' === $role) {
            $family = $this->familyRepository->findOneBy(['parent' => $user->getId()]);
            $chat = $this->chatRepository->findBy(['family' => $family->getId()]);
        }

        $response = [];

        if ($chat) {
            foreach ($chat as $value) {
                $lastMessage = $this->messageRepository->findOneBy(['chat' => $value->getId()], ['id' => 'DESC']);

                if (!$lastMessage) {
                    $response[] = $this->chatArray($value);
                }

                if ($lastMessage) {
                    $response[] = $this->lastMessageChatArray($value, $lastMessage);
                }
            }
        }

        return $response;
    }

    private function chatArray($value): array
    {
        return [
            'chatId' => $value->getId(),
            'nurse' => [
                'id' => $value->getNurse()->getId(),
                'name' => $value->getNurse()->getNurse()->getFirstname().' '.$value->getNurse()->getNurse()->getLastname(),
            ],
            'family' => [
                'id' => $value->getFamily()->getId(),
                'name' => $value->getFamily()->getParent()->getFirstname().' '.$value->getFamily()->getParent()->getLastname(),
            ],
        ];
    }

    private function lastMessageChatArray($value, $lastMessage): array
    {
        return [
            'chatId' => $value->getId(),
            'nurse' => [
                'id' => $value->getNurse()->getId(),
                'name' => $value->getNurse()->getNurse()->getFirstname().' '.$value->getNurse()->getNurse()->getLastname(),
            ],
            'family' => [
                'id' => $value->getFamily()->getId(),
                'name' => $value->getFamily()->getParent()->getFirstname().' '.$value->getFamily()->getParent()->getLastname(),
            ],
            'lastMessage' => [
                'message' => $lastMessage->getMessage(),
                'sendDate' => $lastMessage->getSendDate()->format('Y-m-d H:i:s'),
            ],
        ];
    }
}
