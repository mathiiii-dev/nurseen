<?php

namespace App\Controller;

use App\Entity\Feed;
use App\Repository\FeedImageRepository;
use App\Repository\FeedRepository;
use App\Repository\NurseRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FeedController extends AbstractController
{
    private NurseRepository $nurseRepository;
    private FeedRepository $feedRepository;
    private FeedImageRepository $feedImageRepository;
    private ManagerRegistry $doctrine;

    public function __construct(NurseRepository     $nurseRepository,
                                FeedRepository      $feedRepository,
                                FeedImageRepository $feedImageRepository,
                                ManagerRegistry     $doctrine
    )
    {
        $this->nurseRepository = $nurseRepository;
        $this->feedRepository = $feedRepository;
        $this->feedImageRepository = $feedImageRepository;
        $this->doctrine = $doctrine;
    }

    #[Route('/feed/{nurseId}', name: 'app_feed_get', methods: 'GET')]
    public function get(int $nurseId): Response
    {
        return $this->json($this->feedRepository->findBy(['nurse' => $nurseId]), Response::HTTP_OK, [], ['groups' => 'feed']);
    }

    #[Route('/feed/{nurseId}', name: 'app_feed_post', methods: 'POST')]
    public function post(Request $request, int $nurseId): Response
    {
        $data = $request->toArray();
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurseId]);
        $feed = (new Feed())->setCreationDate(new \DateTime())->setText($data['text'])->setNurse($nurse);
        $em = $this->doctrine->getManager();
        $em->persist($feed);
        $em->flush();

        return $this->json([], Response::HTTP_CREATED);
    }
}
