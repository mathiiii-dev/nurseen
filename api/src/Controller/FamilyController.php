<?php

namespace App\Controller;

use App\Entity\Kid;
use App\Entity\Nurse;
use App\Handler\FamilyHandler;
use App\Repository\FamilyRepository;
use App\Repository\KidRepository;
use App\Repository\NurseRepository;
use App\Service\LinkCodeService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FamilyController extends AbstractController
{
    private LinkCodeService $codeService;
    private FamilyHandler $familyHandler;
    private FamilyRepository $familyRepository;
    private KidRepository $kidRepository;
    private NurseRepository $nurseRepository;

    public function __construct(LinkCodeService $codeService, FamilyHandler $familyHandler, FamilyRepository $familyRepository, KidRepository $kidRepository, NurseRepository $nurseRepository)
    {
        $this->codeService = $codeService;
        $this->familyHandler = $familyHandler;
        $this->familyRepository = $familyRepository;
        $this->kidRepository = $kidRepository;
        $this->nurseRepository = $nurseRepository;
    }

    #[IsGranted('ROLE_PARENT', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/family/{familyId}/kid', name: 'app_family_kid', methods: 'POST')]
    public function link(Request $request, int $familyId): Response
    {
        try {
            $data = $request->toArray();
            $nurse = $this->codeService->validate($data['code']);
            $family = $this->familyRepository->findOneBy(['parent' => $familyId]);
            $this->familyHandler->handleFamilyKidCreate($data, $nurse, $family);
            return new JsonResponse([], Response::HTTP_CREATED);
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(), $exception->getCode());
        }
    }

    #[Route('/family/{nurseId}', name: 'app_family_nurse', methods: 'GET')]
    public function getFamilyNurse(int $nurseId): Response
    {
        $nurse = $this->nurseRepository->findOneBy(['id' => $nurseId]);
        $parents = [];
        /**
         * @var $kid Kid
         */
        foreach ($nurse->getKids()->toArray() as $kid) {
            if ($kid->getFamily()->getChats()->count() === 0) {
                $parents[] = [
                    'name' => $kid->getFamily()->getParent()->getFirstname() . ' ' . $kid->getFamily()->getParent()->getLastname(),
                    'id' => $kid->getFamily()->getParent()->getId(),
                ];
            }
        }

        return new JsonResponse(array_values(array_unique($parents, SORT_REGULAR)), Response::HTTP_CREATED);
    }
}
