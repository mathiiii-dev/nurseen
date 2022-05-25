<?php

namespace App\Controller;

use App\Entity\User;
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
    #[Route('/family/{family}/kid', name: 'app_family_kid', methods: 'POST')]
    public function link(Request $request, User $family): Response
    {
        $this->denyAccessUnlessGranted('owner', $family);
        try {
            $data = $request->toArray();

            $family = $this->familyRepository->findOneBy(['parent' => $family->getId()]);
            $code = $this->linkCodeRepository->findOneBy(['code' => $data['code']]);
            $nurse = $this->nurseRepository->findOneBy(['id' => $code->getNurse()->getId()]);

            $this->familyHandler->handleFamilyKidCreate($data, $nurse, $family);

            return new JsonResponse([], Response::HTTP_CREATED);
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage(), $exception->getCode());
        }
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/family/{nurse}', name: 'app_family_nurse', methods: 'GET')]
    public function getFamilyNurse(User $nurse): Response
    {
        $this->denyAccessUnlessGranted('owner', $nurse);
        return new JsonResponse(
            $this->familyManager->getFamilyNurse(
                $this->nurseRepository->findOneBy(['nurse' => $nurse->getId()])
            ),
            Response::HTTP_CREATED
        );
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/family/{nurse}/list', name: 'app_family_nurse_list', methods: 'GET')]
    public function getFamilyNurseList(User $nurse): Response
    {
        $this->denyAccessUnlessGranted('owner', $nurse);
        return new JsonResponse(
            $this->familyManager->getFamilyNurseList(
                $this->nurseRepository->findOneBy(['nurse' => $nurse->getId()])
            ),
            Response::HTTP_CREATED
        );
    }

    #[IsGranted('ROLE_PARENT', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/family/{family}/nurse', name: 'app_family_nurse_get', methods: 'GET')]
    public function getNurse(User $family): Response
    {
        $this->denyAccessUnlessGranted('owner', $family);
        $familyId = $this->familyRepository->findOneBy(['parent' => $family->getId()]);
        $kid = $this->kidRepository->findOneBy(['id' => $familyId->getKids()->get(0)]);

        $data = [];
        if ($kid) {
            $nurse = $this->nurseRepository->findOneBy(['id' => $kid->getNurse()->getId()]);
            $data = $this->familyManager->getNurse($nurse);
        }

        return new JsonResponse($data, Response::HTTP_OK);
    }
}
