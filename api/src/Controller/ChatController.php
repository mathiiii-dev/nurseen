<?php

namespace App\Controller;

use App\Entity\Chat;
use App\Repository\ChatRepository;
use App\Repository\FamilyRepository;
use App\Repository\KidRepository;
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
    private KidRepository $kidRepository;

    public function __construct(NurseRepository   $nurseRepository,
                                FamilyRepository  $familyRepository,
                                ManagerRegistry   $doctrine,
                                ChatRepository    $chatRepository,
                                MessageRepository $messageRepository,
                                KidRepository     $kidRepository
    )
    {
        $this->nurseRepository = $nurseRepository;
        $this->familyRepository = $familyRepository;
        $this->doctrine = $doctrine;
        $this->chatRepository = $chatRepository;
        $this->messageRepository = $messageRepository;
        $this->kidRepository = $kidRepository;
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

    #[Route('/chat/family', name: 'app_chat_family')]
    public function chatFamily(Request $request): Response
    {
        $data = $request->toArray();
        $family = $this->familyRepository->findOneBy(['parent' => $data['family']]);
        $kid = $this->kidRepository->findOneBy(['family' => $family->getId()]);
        $nurse = $this->nurseRepository->findOneBy(['id' => $kid->getNurse()->getId()]);
        $chat = (new Chat())->setNurse($nurse)->setFamily($family);
        $em = $this->doctrine->getManager();
        $em->persist($chat);
        $em->flush();
        return $this->json([], Response::HTTP_CREATED);
    }

    #[Route('/chat/{userId}/{user}', name: 'app_chat_nurse')]
    public function getChat(int $userId, string $user): Response
    {
        $chat = null;
        if ($user === 'nurse') {
            $nurse = $this->nurseRepository->findOneBy(['nurse' => $userId]);
            $chat = $this->chatRepository->findBy(['nurse' => $nurse->getId()]);
        }

        if ($user === 'family') {
            $family = $this->familyRepository->findOneBy(['parent' => $userId]);
            $chat = $this->chatRepository->findBy(['family' => $family->getId()]);
        }

        $response = [];

        if ($chat) {
            foreach ($chat as $value) {
                $lastMessage = $this->messageRepository->findOneBy(['chat' => $value->getId()], ['id' => 'DESC']);
                if($lastMessage) {
                    array_push($response, [
                        'chatId' => $value->getId(),
                        'nurse' => [
                            'id' => $value->getNurse()->getId(),
                            'name' => $value->getNurse()->getNurse()->getFirstname() . ' ' . $value->getNurse()->getNurse()->getLastname()
                        ],
                        'family' => [
                            'id' => $value->getFamily()->getId(),
                            'name' => $value->getFamily()->getParent()->getFirstname() . ' ' . $value->getFamily()->getParent()->getLastname()
                        ],
                        'lastMessage' => [
                            'message' => $lastMessage->getMessage(),
                            'sendDate' => $lastMessage->getSendDate()->format('Y-m-d H:i:s')
                        ]
                    ]);
                } else {
                    array_push($response, [
                        'chatId' => $value->getId(),
                        'nurse' => [
                            'id' => $value->getNurse()->getId(),
                            'name' => $value->getNurse()->getNurse()->getFirstname() . ' ' . $value->getNurse()->getNurse()->getLastname()
                        ],
                        'family' => [
                            'id' => $value->getFamily()->getId(),
                            'name' => $value->getFamily()->getParent()->getFirstname() . ' ' . $value->getFamily()->getParent()->getLastname()
                        ]
                    ]);
                }

            }
        }


        return $this->json($response, Response::HTTP_OK);
    }
}
