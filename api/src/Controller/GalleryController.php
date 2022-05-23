<?php

namespace App\Controller;

use App\Entity\Gallery;
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
use Symfony\Component\HttpFoundation\File\UploadedFile;
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
    #[Route('/gallery/{nurseId}', name: 'app_gallery', methods: 'POST')]
    public function index(Request $request, int $nurseId): JsonResponse
    {
        $files = $request->files;
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurseId]);

        /* @var UploadedFile $file */
        foreach ($files as $file) {
            $fileName = $this->uploadService->getFileName($file);

            $this->galleryHandler->handleGalleryCreate($fileName, $nurse);

            $this->uploadService->uploadFile(
                $file,
                $this->getParameter('gallery_directory').'/'.$nurseId,
                $fileName
            );
        }

        return $this->json([], Response::HTTP_CREATED);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/gallery/nurse/{nurseId}', name: 'app_gallery_get_nurse', methods: 'GET')]
    public function galleryNurse(int $nurseId, Request $request): JsonResponse
    {
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurseId]);
        $photos = $this->galleryRepository->findBy(['nurse' => $nurse->getId()]);

        return $this->json(
            $this->paginationService->getPagination($request, $photos),
            Response::HTTP_CREATED,
            [],
            ['groups' => 'gallery']
        );
    }

    #[IsGranted('ROLE_PARENT', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/gallery/family/{familyId}', name: 'app_gallery_get_family', methods: 'GET')]
    public function galleryFamily(int $familyId, Request $request): JsonResponse
    {
        $family = $this->familyRepository->findOneBy(['parent' => $familyId]);
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
        $this->galleryHandler->handleGalleryDelete($gallery);

        return $this->json([], Response::HTTP_NO_CONTENT);
    }
}
