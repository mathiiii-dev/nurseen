<?php

namespace App\Controller;

use App\Manager\KidManager;
use Doctrine\Persistence\ManagerRegistry;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class KidController extends AbstractController
{
    private ManagerRegistry $doctrine;
    private KidManager $kidManager;
    private Security $security;

    public function __construct(KidManager $kidManager, ManagerRegistry $doctrine, Security $security)
    {
        $this->doctrine = $doctrine;
        $this->kidManager = $kidManager;
        $this->security = $security;
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/kid/nurse/{nurseId}', name: 'app_kid_nurse')]
    public function index(int $nurseId): JsonResponse
    {
        $kids = $this->kidManager->getKidsByNurse($nurseId);
        $this->denyAccessUnlessGranted('owner', $kids[0]);
        return $this->json($kids, Response::HTTP_OK, [], ['groups' => 'kid_list']);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/kid/{kidId}/activate', name: 'app_kid_nurse_activate', methods: 'POST')]
    public function activate(int $kidId): JsonResponse
    {
        $kid = $this->kidManager->getKid($kidId);
        $this->denyAccessUnlessGranted('owner', $kid);
        $activated = $kid->getActivated();
        $kid->setActivated(!$activated);
        $entityManager = $this->doctrine->getManager();
        $entityManager->flush();

        return $this->json($kid, Response::HTTP_OK, [], ['groups' => 'kid_list']);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/kid/{kidId}/archive', name: 'app_kid_nurse_achive', methods: 'POST')]
    public function archive(int $kidId): JsonResponse
    {
        $kid = $this->kidManager->getKid($kidId);
        $this->denyAccessUnlessGranted('owner', $kid);
        $kid->setArchived(true);
        $entityManager = $this->doctrine->getManager();
        $entityManager->flush();

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
    public function getKidByFamily(int $familyId): JsonResponse
    {
        $kids = $this->kidManager->getKidsByFamily($familyId);
        $this->denyAccessUnlessGranted('owner', $kids[0]);

        return $this->json($kids, Response::HTTP_OK, [], ['groups' => 'kid_list']);
    }
}
