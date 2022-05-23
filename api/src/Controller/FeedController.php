<?php

namespace App\Controller;

use App\Entity\Feed;
use App\Entity\Kid;
use App\Handler\FeedHandler;
use App\Handler\FeedImageHandler;
use App\Repository\FamilyRepository;
use App\Repository\FeedRepository;
use App\Repository\NurseRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FeedController extends AbstractController
{
    private NurseRepository $nurseRepository;
    private FeedRepository $feedRepository;
    private FamilyRepository $familyRepository;
    private FeedHandler $feedHandler;
    private FeedImageHandler $feedImageHandler;

    public function __construct(
        NurseRepository  $nurseRepository,
        FeedRepository   $feedRepository,
        FamilyRepository $familyRepository,
        FeedHandler      $feedHandler,
        FeedImageHandler $feedImageHandler
    )
    {
        $this->nurseRepository = $nurseRepository;
        $this->feedRepository = $feedRepository;
        $this->familyRepository = $familyRepository;
        $this->feedHandler = $feedHandler;
        $this->feedImageHandler = $feedImageHandler;
    }

    #[Route('/feed/{nurseId}', name: 'app_feed_get', methods: 'GET')]
    public function get(int $nurseId): Response
    {
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurseId]);

        return $this->json(
            $this->feedRepository->findBy(['nurse' => $nurse->getId()], ['id' => 'DESC']),
            Response::HTTP_OK,
            [],
            ['groups' => 'feed']
        );
    }

    #[Route('/feed/family/{familyId}', name: 'app_feed_get_family', methods: 'GET')]
    public function getFamily(int $familyId): Response
    {
        $family = $this->familyRepository->findOneBy(['parent' => $familyId]);
        /**
         * @var Kid $kid
         */
        $kid = $family->getKids()->get(0);
        $feed = [];
        if ($kid) {
            $nurseId = $kid->getNurse()->getId();
            $feed = $this->feedRepository->findBy(['nurse' => $nurseId], ['id' => 'DESC']);
        }
        return $this->json($feed, Response::HTTP_OK, [], ['groups' => 'feed']);
    }

    #[Route('/feed/{nurseId}', name: 'app_feed_post', methods: 'POST')]
    public function post(Request $request, int $nurseId): Response
    {
        $text = $request->get('text');
        $feed = $this->feedHandler->handleFeedCreate($text, $nurseId);
        $files = $request->files;

        if ($files) {
            $this->feedImageHandler->handleFeedImageCreate($files, $feed);
        }

        return $this->json([], Response::HTTP_CREATED);
    }

    #[Route('/feed/{feed}', name: 'app_feed_delete', methods: 'DELETE')]
    public function delete(Feed $feed): Response
    {
        $this->feedHandler->handleFeedDelete($feed);

        return $this->json([], Response::HTTP_NO_CONTENT);
    }

    #[Route('/feed/{feed}', name: 'app_feed_patch', methods: 'PATCH')]
    public function patch(Feed $feed, Request $request): Response
    {
        $this->feedHandler->handleFeedUpdate($request, $feed);

        return $this->json([], Response::HTTP_NO_CONTENT);
    }
}
