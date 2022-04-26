<?php

namespace App\Handler;

use App\Entity\LinkCode;
use App\Repository\NurseRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;

class LinkCodeHandler
{
    private ManagerRegistry $doctrine;
    private NurseRepository $nurseRepository;

    public function __construct(ManagerRegistry $doctrine, NurseRepository $nurseRepository)
    {
        $this->doctrine = $doctrine;
        $this->nurseRepository = $nurseRepository;
    }

    public function handleLinkeCodeCreate(Request $request, int $nurse)
    {
        $entityManager = $this->doctrine->getManager();
        $data = $request->toArray();
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurse]);
        $code = new LinkCode();
        $code->setNurse($nurse)
            ->setCode($data['code'])
            ->setExpiration(new \DateTime($data['expiration']));
        $entityManager->persist($code);
        $entityManager->flush();
    }
}