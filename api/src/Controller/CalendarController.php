<?php

namespace App\Controller;

use App\Handler\CalendarHandler;
use App\Manager\KidManager;
use App\Repository\CalendarRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CalendarController extends AbstractController
{
    private CalendarHandler $calendarHandler;
    private KidManager $kidManager;
    private CalendarRepository $calendarRepository;

    public function __construct(CalendarHandler $calendarHandler, KidManager $kidManager, CalendarRepository $calendarRepository)
    {
        $this->calendarHandler = $calendarHandler;
        $this->kidManager = $kidManager;
        $this->calendarRepository = $calendarRepository;
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/calendar/kid/{kidId}', name: 'app_calendar_kid', methods: 'POST')]
    public function calendarKid(Request $request, int $kidId): JsonResponse
    {
        $kid = $this->kidManager->getKid($kidId);
        $this->denyAccessUnlessGranted('owner', $kid);
        $this->calendarHandler->handleCalendarCreate($request, $kid);
        return $this->json([], Response::HTTP_CREATED);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/calendar/nurse/{nurseId}', name: 'app_calendar_nurse', methods: 'GET')]
    public function calendarNurse(int $nurseId): JsonResponse
    {
        $events = $this->calendarRepository->getCalendarByNurse($nurseId);
        return $this->json($events, Response::HTTP_CREATED);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/calendar/{calendarId}/kid/{kidId}', name: 'app_calendar_edit', methods: 'PATCH')]
    public function edit(int $calendarId, Request $request, int $kidId): JsonResponse
    {
        $kid = $this->kidManager->getKid($kidId);
        $this->denyAccessUnlessGranted('owner', $kid);
        $event = $this->calendarRepository->findOneBy(['id' => $calendarId]);

        $this->calendarHandler->handleEditCalendar($request, $event, $kid);

        return $this->json([], Response::HTTP_OK);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/calendar/{calendarId}', name: 'app_calendar_delete', methods: 'DELETE')]
    public function delete(int $calendarId): JsonResponse
    {
        $event = $this->calendarRepository->findOneBy(['id' => $calendarId]);

        $this->calendarHandler->handleDeleteCalendar($event);

        return $this->json([], Response::HTTP_OK);
    }

}
