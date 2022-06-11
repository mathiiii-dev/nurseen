<?php

namespace App\Controller;

use App\Entity\Gallery;
use App\Entity\User;
use App\Handler\GalleryHandler;
use App\Repository\FamilyRepository;
use App\Repository\GalleryRepository;
use App\Repository\KidRepository;
use App\Repository\NurseRepository;
use App\Service\PaginationService;
use App\Service\UploadService;
use Exception;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class GalleryController extends AbstractController
{
    private NurseRepository $nurseRepository;
    private GalleryRepository $galleryRepository;
    private KidRepository $kidRepository;
    private FamilyRepository $familyRepository;
    private UploadService $uploadService;
    private GalleryHandler $galleryHandler;
    private PaginationService $paginationService;

    public function __construct(
        NurseRepository $nurseRepository,
        GalleryRepository $galleryRepository,
        KidRepository $kidRepository,
        FamilyRepository $familyRepository,
        UploadService $uploadService,
        GalleryHandler $galleryHandler,
        PaginationService $paginationService
    ) {
        $this->nurseRepository = $nurseRepository;
        $this->galleryRepository = $galleryRepository;
        $this->kidRepository = $kidRepository;
        $this->familyRepository = $familyRepository;
        $this->uploadService = $uploadService;
        $this->galleryHandler = $galleryHandler;
        $this->paginationService = $paginationService;
    }

    /**
     * @throws Exception
     */
    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/gallery/{nurse}', name: 'app_gallery', methods: 'POST')]
    public function index(Request $request, User $nurse): JsonResponse
    {
        $this->denyAccessUnlessGranted('owner', $nurse);

        $data = $request->toArray();

        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurse->getId()]);
        $this->galleryHandler->handleGalleryCreate($data, $nurse);

        return $this->json([], Response::HTTP_CREATED);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/gallery/nurse/{nurse}', name: 'app_gallery_get_nurse', methods: 'GET')]
    public function galleryNurse(User $nurse, Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted('owner', $nurse);
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurse->getId()]);
        $photos = $this->galleryRepository->findBy(['nurse' => $nurse->getId()]);

        return $this->json(
            $this->paginationService->getPagination($request, $photos),
            Response::HTTP_CREATED,
            [],
            ['groups' => 'gallery']
        );
    }

    #[IsGranted('ROLE_PARENT', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/gallery/family/{family}', name: 'app_gallery_get_family', methods: 'GET')]
    public function galleryFamily(User $family, Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted('owner', $family);
        $family = $this->familyRepository->findOneBy(['parent' => $family->getId()]);
        $kid = $this->kidRepository->findOneBy(['family' => $family->getId()]);

        $photos = [];
        if ($kid) {
            $photos = $this->galleryRepository->findBy(['nurse' => $kid->getNurse()->getId()]);
        }

        return $this->json(
            $this->paginationService->getPagination($request, $photos),
            Response::HTTP_CREATED,
            [],
            ['groups' => 'gallery']
        );
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/gallery/{gallery}', name: 'app_gallery_delete', methods: 'DELETE')]
    public function delete(Gallery $gallery): JsonResponse
    {
        $this->denyAccessUnlessGranted('owner', $gallery);
        $this->galleryHandler->handleGalleryDelete($gallery);

        return $this->json([], Response::HTTP_NO_CONTENT);
    }
}
