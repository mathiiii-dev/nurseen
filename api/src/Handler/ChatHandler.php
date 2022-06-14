<?php

namespace App\Handler;

use App\Entity\Chat;
use App\Repository\FamilyRepository;
use App\Repository\KidRepository;
use App\Repository\NurseRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;

class ChatHandler
{
    private NurseRepository $nurseRepository;
    private FamilyRepository $familyRepository;
    private ManagerRegistry $doctrine;
    private KidRepository $kidRepository;

    public function __construct(NurseRepository $nurseRepository, FamilyRepository $familyRepository, ManagerRegistry $doctrine, KidRepository $kidRepository)
    {
        $this->nurseRepository = $nurseRepository;
        $this->familyRepository = $familyRepository;
        $this->doctrine = $doctrine;
        $this->kidRepository = $kidRepository;
    }

    public function handleChatCreate(Request $request): void
    {
        $data = $request->toArray();

        $nurse = $this->nurseRepository->findOneBy(['nurse' => $data['nurse']]);
        $family = $this->familyRepository->findOneBy(['parent' => $data['family']]);

        $chat = (new Chat())
            ->setNurse($nurse)
            ->setFamily($family);

        $em = $this->doctrine->getManager();
        $em->persist($chat);
        $em->flush();
    }

    public function handleCreateFamilyChat(Request $request): Chat
    {
        $data = $request->toArray();

        $family = $this->familyRepository->findOneBy(['parent' => $data['family']]);
        $kid = $this->kidRepository->findOneBy(['family' => $family->getId()]);
        $nurse = $this->nurseRepository->findOneBy(['id' => $kid->getNurse()->getId()]);

        $chat = (new Chat())
            ->setNurse($nurse)
            ->setFamily($family);

        $em = $this->doctrine->getManager();
        $em->persist($chat);
        $em->flush();

        return $chat;
    }
}
