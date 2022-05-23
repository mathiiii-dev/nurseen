<?php

namespace App\Controller;

use App\Entity\Calendar;
use App\Entity\Kid;
use App\Handler\CalendarHandler;
use App\Repository\CalendarRepository;
use App\Repository\FamilyRepository;
use Exception;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CalendarController extends AbstractController
{
    private CalendarHandler $calendarHandler;
    private CalendarRepository $calendarRepository;
    private FamilyRepository $familyRepository;

    public function __construct(CalendarHandler $calendarHandler, CalendarRepository $calendarRepository, FamilyRepository $familyRepository)
    {
        $this->calendarHandler = $calendarHandler;
        $this->calendarRepository = $calendarRepository;
        $this->familyRepository = $familyRepository;
    }

    /**
     * @throws Exception
     */
    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/calendar/kid/{kid}', name: 'app_calendar_kid', methods: 'POST')]
    public function calendarKid(Request $request, Kid $kid): JsonResponse
    {
        $this->denyAccessUnlessGranted('owner', $kid);
        try {
            $this->calendarHandler->handleCalendarCreate($request, $kid);
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        return $this->json([], Response::HTTP_CREATED);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/calendar/nurse/{nurseId}', name: 'app_calendar_nurse', methods: 'GET')]
    public function calendarNurse(int $nurseId): JsonResponse
    {
        return $this->json($this->calendarRepository->getCalendarByNurse($nurseId), Response::HTTP_OK);
    }

    /**
     * @throws Exception
     */
    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/calendar/{calendar}/kid/{kid}', name: 'app_calendar_edit', methods: 'PATCH')]
    public function edit(Calendar $calendar, Request $request, Kid $kid): JsonResponse
    {
        $this->denyAccessUnlessGranted('owner', $kid);

        try {
            $this->calendarHandler->handleEditCalendar($request, $calendar, $kid);
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        return $this->json([], Response::HTTP_NO_CONTENT);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/calendar/{calendar}', name: 'app_calendar_delete', methods: 'DELETE')]
    public function delete(Calendar $calendar): JsonResponse
    {
        $this->calendarHandler->handleDeleteCalendar($calendar);

        return $this->json([], Response::HTTP_NO_CONTENT);
    }

    #[IsGranted('ROLE_PARENT', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/calendar/family/{familyId}', name: 'app_calendar_family', methods: 'GET')]
    public function calendarFamily(int $familyId): JsonResponse
    {
        $family = $this->familyRepository->findOneBy(['parent' => $familyId]);
        return $this->json($this->calendarRepository->getCalendarByFamily($family->getId()), Response::HTTP_OK);
    }
}
