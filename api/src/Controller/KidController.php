<?php

namespace App\Controller;

use App\Entity\Kid;
use App\Handler\KidHandler;
use App\Manager\KidManager;
use App\Service\PaginationService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class KidController extends AbstractController
{
    private KidManager $kidManager;
    private KidHandler $kidHandler;
    private PaginationService $pagination;

    public function __construct(KidManager $kidManager, KidHandler $kidHandler, PaginationService $pagination)
    {
        $this->kidManager = $kidManager;
        $this->kidHandler = $kidHandler;
        $this->pagination = $pagination;
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/kid/nurse/{nurseId}', name: 'app_kid_nurse')]
    public function index(int $nurseId, Request $request): JsonResponse
    {
        $kids = $this->kidManager->getKidsByNurse($nurseId);
        if ($kids) {
            $this->denyAccessUnlessGranted('owner', $kids[0]);
        }

        $data = $this->pagination->getPagination($request, $kids, 7);

        return $this->json($data, Response::HTTP_OK, [], ['groups' => 'kid_list']);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/kid/nurse/{nurseId}/all', name: 'app_kid_nurse_all')]
    public function getAll(int $nurseId): JsonResponse
    {
        $kids = $this->kidManager->getKidsByNurse($nurseId);
        if ($kids) {
            $this->denyAccessUnlessGranted('owner', $kids[0]);
        }

        return $this->json($kids, Response::HTTP_OK, [], ['groups' => 'kid_list']);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/kid/{kid}/activate', name: 'app_kid_nurse_activate', methods: 'POST')]
    public function activate(Kid $kid): JsonResponse
    {
        $this->denyAccessUnlessGranted('owner', $kid);

        $this->kidHandler->handleKidActivation($kid);

        return $this->json($kid, Response::HTTP_OK, [], ['groups' => 'kid_list']);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/kid/{kid}/archive', name: 'app_kid_nurse_achive', methods: 'POST')]
    public function archive(Kid $kid): JsonResponse
    {
        $this->denyAccessUnlessGranted('owner', $kid);

        $this->kidHandler->handleKidArchivation($kid);

        return $this->json($kid, Response::HTTP_OK, [], ['groups' => 'kid_list']);
    }

    #[Route('/kid/{kidId}', name: 'app_kid', methods: 'GET')]
    public function getKid(int $kidId): JsonResponse
    {
        $kid = $this->kidManager->getKid($kidId);
        $this->denyAccessUnlessGranted('owner', $kid);
        return $this->json($kid, Response::HTTP_OK, [], ['groups' => 'kid_list']);
    }

    #[IsGranted('ROLE_PARENT', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/kid/family/{familyId}', name: 'app_kid_family')]
    public function getKidByFamily(int $familyId, Request $request): JsonResponse
    {
        $kids = $this->kidManager->getKidsByFamily($familyId);
        if ($kids) {
            $this->denyAccessUnlessGranted('owner', $kids[0]);
        }

        $data = $this->pagination->getPagination($request, $kids, 7);

        return $this->json($data, Response::HTTP_OK, [], ['groups' => 'kid_list']);
    }
}
