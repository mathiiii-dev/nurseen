<?php

namespace App\Controller;

use App\Handler\FamilyHandler;
use App\Manager\FamilyManager;
use App\Repository\FamilyRepository;
use App\Repository\KidRepository;
use App\Repository\LinkCodeRepository;
use App\Repository\NurseRepository;
use Exception;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FamilyController extends AbstractController
{
    private FamilyHandler $familyHandler;
    private FamilyRepository $familyRepository;
    private KidRepository $kidRepository;
    private NurseRepository $nurseRepository;
    private LinkCodeRepository $linkCodeRepository;
    private FamilyManager $familyManager;

    public function __construct(
        FamilyHandler $familyHandler,
        FamilyRepository $familyRepository,
        KidRepository $kidRepository,
        NurseRepository $nurseRepository,
        LinkCodeRepository $linkCodeRepository,
        FamilyManager $familyManager
    ) {
        $this->familyHandler = $familyHandler;
        $this->familyRepository = $familyRepository;
        $this->kidRepository = $kidRepository;
        $this->nurseRepository = $nurseRepository;
        $this->linkCodeRepository = $linkCodeRepository;
        $this->familyManager = $familyManager;
    }

    /**
     * @throws Exception
     */
    #[IsGranted('ROLE_PARENT', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/family/{familyId}/kid', name: 'app_family_kid', methods: 'POST')]
    public function link(Request $request, int $familyId): Response
    {
        try {
            $data = $request->toArray();

            $family = $this->familyRepository->findOneBy(['parent' => $familyId]);
            $code = $this->linkCodeRepository->findOneBy(['code' => $data['code']]);
            $nurse = $this->nurseRepository->findOneBy(['id' => $code->getNurse()->getId()]);

            $this->familyHandler->handleFamilyKidCreate($data, $nurse, $family);

            return new JsonResponse([], Response::HTTP_CREATED);
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage(), $exception->getCode());
        }
    }

    #[Route('/family/{nurseId}', name: 'app_family_nurse', methods: 'GET')]
    public function getFamilyNurse(int $nurseId): Response
    {
        return new JsonResponse(
            $this->familyManager->getFamilyNurse(
                $this->nurseRepository->findOneBy(['nurse' => $nurseId])
            ),
            Response::HTTP_CREATED
        );
    }

    #[Route('/family/{nurseId}/list', name: 'app_family_nurse_list', methods: 'GET')]
    public function getFamilyNurseList(int $nurseId): Response
    {
        return new JsonResponse(
            $this->familyManager->getFamilyNurseList(
                $this->nurseRepository->findOneBy(['nurse' => $nurseId])
            ),
            Response::HTTP_CREATED
        );
    }

    #[Route('/family/{familyId}/nurse', name: 'app_family_nurse_get', methods: 'GET')]
    public function getNurse(int $familyId): Response
    {
        $familyId = $this->familyRepository->findOneBy(['parent' => $familyId]);
        $kid = $this->kidRepository->findOneBy(['id' => $familyId->getKids()->get(0)]);
        $nurse = $this->nurseRepository->findOneBy(['id' => $kid->getNurse()->getId()]);

        return new JsonResponse($this->familyManager->getNurse($nurse), Response::HTTP_OK);
    }
}
