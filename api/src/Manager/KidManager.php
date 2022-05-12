<?php

namespace App\Manager;

use App\Entity\Kid;
use App\Repository\FamilyRepository;
use App\Repository\KidRepository;
use App\Repository\NurseRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class KidManager
{
    private KidRepository $kidRepository;
    private NurseRepository $nurseRepository;
    private FamilyRepository $familyRepository;

    public function __construct(KidRepository $kidRepository, NurseRepository $nurseRepository, FamilyRepository $familyRepository)
    {
        $this->kidRepository = $kidRepository;
        $this->nurseRepository = $nurseRepository;
        $this->familyRepository = $familyRepository;
    }

    public function getKid(int $kidId): Kid
    {
        $kid = $this->kidRepository->findOneBy(['id' => $kidId]);
        if (!$kid) {
            throw new NotFoundHttpException('No kid found');
        }

        return $kid;
    }

    public function getKidsByNurse(int $nurseId): array
    {
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurseId]);

        if (!$nurse) {
            throw new NotFoundHttpException('No nurse found');
        }

        return $this->kidRepository->findKidsByNurseNonArchived($nurse->getId());
    }

    public function getKidsByFamily(int $familyId): array
    {
        $family = $this->familyRepository->findOneBy(['parent' => $familyId]);

        if (!$family) {
            throw new \Exception('No family found', 404);
        }

        return $this->kidRepository->findBy(['family' => $family->getId()]);
    }
}
