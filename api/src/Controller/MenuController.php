<?php

namespace App\Controller;

use App\Entity\Menu;
use App\Entity\Nurse;
use App\Repository\FamilyRepository;
use App\Repository\KidRepository;
use App\Repository\MenuRepository;
use App\Repository\NurseRepository;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MenuController extends AbstractController
{
    private ManagerRegistry $doctrine;
    private NurseRepository $nurseRepository;
    private MenuRepository $menuRepository;
    private FamilyRepository $familyRepository;
    private KidRepository $kidRepository;

    public function __construct(
        ManagerRegistry  $doctrine,
        NurseRepository  $nurseRepository,
        MenuRepository   $menuRepository,
        FamilyRepository $familyRepository,
        KidRepository    $kidRepository
    )
    {
        $this->doctrine = $doctrine;
        $this->nurseRepository = $nurseRepository;
        $this->menuRepository = $menuRepository;
        $this->familyRepository = $familyRepository;
        $this->kidRepository = $kidRepository;
    }

    /**
     * @throws Exception
     */
    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/menu/add/{nurseId}', name: 'app_menu_add')]
    public function add(Request $request, int $nurseId): Response
    {
        $data = $request->toArray();
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurseId]);
        $menu = (new Menu())->setDate(new \DateTime($data['date']))->setDessert($data['dessert'])->setEntry($data['entry'])->setMeal($data['meal'])->setNurse($nurse);

        $entityManager = $this->doctrine->getManager();

        $entityManager->persist($menu);
        $entityManager->flush();

        return $this->json([], Response::HTTP_CREATED);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/menu/{nurseId}', name: 'app_menu_get', methods: 'GET')]
    public function get(int $nurseId): Response
    {
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurseId]);
        $menu = $this->menuRepository->findOneBy([
            'date' => (new \DateTime())->modify('-1 day'),
            'nurse' => $nurse->getId()
        ]);

        return $this->json($menu, Response::HTTP_OK, [], ['groups' => 'menu']);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/menu/{nurseId}/list', name: 'app_menu_get_list', methods: 'GET')]
    public function getList(int $nurseId): Response
    {
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurseId]);

        $menu = $this->menuRepository->findBy(['nurse' => $nurse->getId()]);

        return $this->json($menu, Response::HTTP_OK, [], ['groups' => 'menu']);
    }

    #[IsGranted('ROLE_PARENT', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/menu/family/{familyId}', name: 'app_menu_get_family', methods: 'GET')]
    public function getMenuFamily(int $familyId): Response
    {
        $family = $this->familyRepository->findOneBy(['parent' => $familyId]);
        $kid = $this->kidRepository->findOneBy(['family' => $family->getId()]);
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $kid->getNurse()->getNurse()->getId()]);
        $menu = $this->menuRepository->findOneBy([
            'date' => (new \DateTime())->modify('-1 day'),
            'nurse' => $nurse->getId()
        ]);


        return $this->json($menu, Response::HTTP_OK, [], ['groups' => 'menu']);
    }

    #[IsGranted('ROLE_PARENT', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/menu/family/{familyId}/list', name: 'app_menu_get_list_family', methods: 'GET')]
    public function getListMenuFamily(int $familyId): Response
    {
        $family = $this->familyRepository->findOneBy(['parent' => $familyId]);
        $kid = $this->kidRepository->findOneBy(['family' => $family->getId()]);
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $kid->getNurse()->getNurse()->getId()]);

        $menu = $this->menuRepository->findBy(['nurse' => $nurse->getId()]);

        return $this->json($menu, Response::HTTP_OK, [], ['groups' => 'menu']);
    }

    /**
     * @throws Exception
     */
    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/menu/{menuId}/edit', name: 'app_menu_edit', methods: 'PATCH')]
    public function edit(int $menuId, Request $request): Response
    {
        $data = $request->toArray();
        $menu = $this->menuRepository->findOneBy(['id' => $menuId]);
        $menu->setDate(new \DateTime($data['date']))->setDessert($data['dessert'])->setEntry($data['entry'])->setMeal($data['meal']);
        $this->doctrine->getManager()->flush();

        return $this->json([], Response::HTTP_CREATED);
    }
}
