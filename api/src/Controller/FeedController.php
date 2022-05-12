<?php

namespace App\Controller;

use App\Entity\Family;
use App\Entity\Feed;
use App\Entity\FeedImage;
use App\Entity\Kid;
use App\Repository\FamilyRepository;
use App\Repository\FeedImageRepository;
use App\Repository\FeedRepository;
use App\Repository\NurseRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class FeedController extends AbstractController
{
    private NurseRepository $nurseRepository;
    private FeedRepository $feedRepository;
    private FeedImageRepository $feedImageRepository;
    private ManagerRegistry $doctrine;
    private SluggerInterface $slugger;
    private ManagerRegistry $managerRegistry;
    private FamilyRepository $familyRepository;

    public function __construct(NurseRepository     $nurseRepository,
                                FeedRepository      $feedRepository,
                                FeedImageRepository $feedImageRepository,
                                ManagerRegistry     $doctrine,
                                SluggerInterface    $slugger,
                                ManagerRegistry     $managerRegistry,
                                FamilyRepository    $familyRepository
    )
    {
        $this->nurseRepository = $nurseRepository;
        $this->feedRepository = $feedRepository;
        $this->feedImageRepository = $feedImageRepository;
        $this->doctrine = $doctrine;
        $this->slugger = $slugger;
        $this->managerRegistry = $managerRegistry;
        $this->familyRepository = $familyRepository;
    }

    #[Route('/feed/{nurseId}', name: 'app_feed_get', methods: 'GET')]
    public function get(int $nurseId): Response
    {
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurseId]);
        return $this->json($this->feedRepository->findBy(['nurse' => $nurse->getId()], ['id' => 'DESC']), Response::HTTP_OK, [], ['groups' => 'feed']);
    }

    #[Route('/feed/family/{familyId}', name: 'app_feed_get_family', methods: 'GET')]
    public function getFamily(int $familyId): Response
    {
        $family = $this->familyRepository->findOneBy(['parent' => $familyId]);
        /**
         * @var Kid $kid
         */
        $kid = $family->getKids()->get(0);
        $nurseId = $kid->getNurse()->getId();
        return $this->json($this->feedRepository->findBy(['nurse' => $nurseId], ['id' => 'DESC']), Response::HTTP_OK, [], ['groups' => 'feed']);
    }

    #[Route('/feed/{nurseId}', name: 'app_feed_post', methods: 'POST')]
    public function post(Request $request, int $nurseId): Response
    {
        $text = $request->get('text');
        $files = $request->files;
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurseId]);
        $feed = (new Feed())->setCreationDate(new \DateTime())->setText($text)->setNurse($nurse);
        $em = $this->doctrine->getManager();
        $em->persist($feed);
        $em->flush();

        if ($files) {
            foreach ($files as $file) {
                $safeFilename = $this->slugger->slug($file->getClientOriginalName());
                $fileName = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

                $feedImage = (new FeedImage())->setUrl($fileName)->setFeed($feed);

                $em->persist($feedImage);
                $em->flush();

                try {
                    $file->move($this->getParameter('feed_directory') . '/' . $feed->getId(), $fileName);
                } catch (FileException $e) {
                    throw new \Exception($e->getMessage());
                }
            }

        }

        return $this->json([], Response::HTTP_CREATED);
    }

    #[Route('/feed/{feed}', name: 'app_feed_delete', methods: 'DELETE')]
    public function delete(Feed $feed): Response
    {
        $em = $this->managerRegistry->getManager();

        foreach ($feed->getFeedImages() as $feedImage) {
            $feed->removeFeedImage($feedImage);
            $em->remove($feedImage);
            $em->flush();
        }

        $em->remove($feed);
        $em->flush();

        return $this->json([], Response::HTTP_NO_CONTENT);
    }

    #[Route('/feed/{feed}', name: 'app_feed_patch', methods: 'PATCH')]
    public function patch(Feed $feed, Request $request): Response
    {
        $data = $request->toArray();
        $feed->setText($data['text']);
        $em = $this->doctrine->getManager();
        $em->flush();

        return $this->json([], Response::HTTP_NO_CONTENT);
    }
}
