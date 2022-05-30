<?php

namespace App\Controller;

use App\Entity\Feed;
use App\Entity\FeedImage;
use App\Entity\Kid;
use App\Entity\User;
use App\Handler\FeedHandler;
use App\Handler\FeedImageHandler;
use App\Repository\FamilyRepository;
use App\Repository\FeedRepository;
use App\Repository\NurseRepository;
use Doctrine\Persistence\ManagerRegistry;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
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
    private ManagerRegistry $doctrine;

    public function __construct(
        NurseRepository $nurseRepository,
        FeedRepository $feedRepository,
        FamilyRepository $familyRepository,
        FeedHandler $feedHandler,
        FeedImageHandler $feedImageHandler,
        ManagerRegistry $doctrine
    ) {
        $this->nurseRepository = $nurseRepository;
        $this->feedRepository = $feedRepository;
        $this->familyRepository = $familyRepository;
        $this->feedHandler = $feedHandler;
        $this->feedImageHandler = $feedImageHandler;
        $this->doctrine = $doctrine;
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/feed/{nurse}', name: 'app_feed_get', methods: 'GET')]
    public function get(User $nurse): Response
    {
        $this->denyAccessUnlessGranted('owner', $nurse);
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurse->getId()]);

        return $this->json(
            $this->feedRepository->findBy(['nurse' => $nurse->getId()], ['id' => 'DESC']),
            Response::HTTP_OK,
            [],
            ['groups' => 'feed']
        );
    }

    #[IsGranted('ROLE_PARENT', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/feed/family/{family}', name: 'app_feed_get_family', methods: 'GET')]
    public function getFamily(User $family): Response
    {
        $this->denyAccessUnlessGranted('owner', $family);
        $family = $this->familyRepository->findOneBy(['parent' => $family->getId()]);
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

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/feed/{nurse}', name: 'app_feed_post', methods: 'POST')]
    public function post(Request $request, User $nurse): Response
    {
        $this->denyAccessUnlessGranted('owner', $nurse);
        $data = $request->toArray();
        $feed = $this->feedHandler->handleFeedCreate($data['text'], $nurse);

        return $this->json($feed->getId(), Response::HTTP_CREATED);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/feed/{feed}/images', name: 'app_feed_post_images', methods: 'POST')]
    public function postImages(Request $request, Feed $feed): Response
    {
        $this->denyAccessUnlessGranted('owner', $feed->getNurse()->getNurse());
        $data = $request->toArray();

        $feedImage = (new FeedImage())->setFeed($feed)->setUrl($data['public_id']);
        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($feedImage);
        $entityManager->flush();

        return $this->json([], Response::HTTP_CREATED);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/feed/{feed}', name: 'app_feed_delete', methods: 'DELETE')]
    public function delete(Feed $feed): Response
    {
        $this->denyAccessUnlessGranted('owner', $feed);
        $this->feedHandler->handleFeedDelete($feed);

        return $this->json([], Response::HTTP_NO_CONTENT);
    }

    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    #[Route('/feed/{feed}', name: 'app_feed_patch', methods: 'PATCH')]
    public function patch(Feed $feed, Request $request): Response
    {
        $this->denyAccessUnlessGranted('owner', $feed);
        $this->feedHandler->handleFeedUpdate($request, $feed);

        return $this->json([], Response::HTTP_NO_CONTENT);
    }
}
