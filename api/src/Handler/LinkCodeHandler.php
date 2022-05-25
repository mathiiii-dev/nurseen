<?php

namespace App\Handler;

use App\Entity\LinkCode;
use App\Entity\User;
use App\Repository\LinkCodeRepository;
use App\Repository\NurseRepository;
use Doctrine\Persistence\ManagerRegistry;

class LinkCodeHandler
{
    private ManagerRegistry $doctrine;
    private NurseRepository $nurseRepository;
    private LinkCodeRepository $linkCodeRepository;

    public function __construct(ManagerRegistry $doctrine, NurseRepository $nurseRepository, LinkCodeRepository $linkCodeRepository)
    {
        $this->doctrine = $doctrine;
        $this->nurseRepository = $nurseRepository;
        $this->linkCodeRepository = $linkCodeRepository;
    }

    public function handleLinkeCodeCreate(User $nurse): int
    {
        $entityManager = $this->doctrine->getManager();
        $code = rand(1000, 9999);
        $linkCode = new LinkCode();
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurse->getId()]);
        $linkCode->setNurse($nurse)
            ->setCode($code);
        $entityManager->persist($linkCode);
        $entityManager->flush();

        return $code;
    }

    public function getNurseLinkCode(int $nurseId): ?int
    {
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurseId]);
        $code = $this->linkCodeRepository->findOneBy(['nurse' => $nurse->getId()]);
        $linkCode = null;
        if ($code) {
            $linkCode = $code->getCode();
        }

        return $linkCode;
    }
}
