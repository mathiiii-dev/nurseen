<?php

namespace App\Controller;

use App\Entity\Gallery;
use App\Repository\FamilyRepository;
use App\Repository\GalleryRepository;
use App\Repository\KidRepository;
use App\Repository\NurseRepository;
use Doctrine\Persistence\ManagerRegistry;
use Pagerfanta\Pagerfanta;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Pagerfanta\Adapter;
use Symfony\Component\String\Slugger\SluggerInterface;

class GalleryController extends AbstractController
{
    private SluggerInterface $slugger;
    private NurseRepository $nurseRepository;
    private ManagerRegistry $doctrine;
    private GalleryRepository $galleryRepository;
    private Filesystem $filesystem;
    private KidRepository $kidRepository;
    private FamilyRepository $familyRepository;

    public function __construct(SluggerInterface  $slugger,
                                NurseRepository   $nurseRepository,
                                ManagerRegistry   $doctrine,
                                GalleryRepository $galleryRepository,
                                Filesystem        $filesystem,
                                KidRepository     $kidRepository,
                                FamilyRepository  $familyRepository
    )
    {
        $this->slugger = $slugger;
        $this->nurseRepository = $nurseRepository;
        $this->doctrine = $doctrine;
        $this->galleryRepository = $galleryRepository;
        $this->filesystem = $filesystem;
        $this->kidRepository = $kidRepository;
        $this->familyRepository = $familyRepository;
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/gallery/{nurseId}', name: 'app_gallery', methods: 'POST')]
    public function index(Request $request, int $nurseId): JsonResponse
    {
        $files = $request->files;
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurseId]);
        $entityManager = $this->doctrine->getManager();

        /* @var UploadedFile $file */
        foreach ($files as $file) {
            $safeFilename = $this->slugger->slug($file->getClientOriginalName());
            $fileName = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

            $photo = (new Gallery())->setUrl($fileName)->setNurse($nurse);
            $entityManager->persist($photo);
            $entityManager->flush();
            try {
                $file->move($this->getParameter('gallery_directory') . '/' . $nurseId, $fileName);
            } catch (FileException $e) {
                throw new \Exception($e->getMessage());
            }
        }

        return $this->json([], Response::HTTP_CREATED);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/gallery/nurse/{nurseId}', name: 'app_gallery_get_nurse', methods: 'GET')]
    public function galleryNurse(int $nurseId, Request $request): JsonResponse
    {
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurseId]);
        $photos = $this->galleryRepository->findBy(['nurse' => $nurse->getId()]);

        $pagerfanta = new Pagerfanta(
            new Adapter\ArrayAdapter($photos)
        );

        $pagerfanta->setCurrentPage($request->query->get('page'));

        return $this->json($pagerfanta, Response::HTTP_CREATED, [], ['groups' => 'gallery']);
    }

    #[IsGranted('ROLE_PARENT', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/gallery/family/{familyId}', name: 'app_gallery_get_family', methods: 'GET')]
    public function galleryFamily(int $familyId, Request $request): JsonResponse
    {
        $family = $this->familyRepository->findOneBy(['parent' => $familyId]);
        $kid = $this->kidRepository->findOneBy(['family' => $family->getId()]);
        $photos = $this->galleryRepository->findBy(['nurse' => $kid->getNurse()->getId()]);

        $pagerfanta = new Pagerfanta(
            new Adapter\ArrayAdapter($photos)
        );

        $pagerfanta->setCurrentPage($request->query->get('page'));

        return $this->json($pagerfanta, Response::HTTP_CREATED, [], ['groups' => 'gallery']);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/gallery/{galleryId}', name: 'app_gallery_delete', methods: 'DELETE')]
    public function delete(int $galleryId): JsonResponse
    {
        $entityManager = $this->doctrine->getManager();
        $photo = $this->galleryRepository->findOneBy(['id' => $galleryId]);
        $this->filesystem->remove($this->getParameter('gallery_directory') . '/' . $photo->getNurse()->getNurse()->getId() . '/' . $photo->getUrl());
        $entityManager->remove($photo);
        $entityManager->flush();
        return $this->json([], Response::HTTP_NO_CONTENT);
    }

}
