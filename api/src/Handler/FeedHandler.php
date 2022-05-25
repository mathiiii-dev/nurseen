<?php

namespace App\Handler;

use App\Entity\Feed;
use App\Entity\User;
use App\Repository\NurseRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;

class FeedHandler
{
    private NurseRepository $nurseRepository;
    private ManagerRegistry $doctrine;

    public function __construct(NurseRepository $nurseRepository, ManagerRegistry $doctrine)
    {
        $this->nurseRepository = $nurseRepository;
        $this->doctrine = $doctrine;
    }

    public function handleFeedCreate(string $text, User $nurse): Feed
    {
        $nurse = $this->nurseRepository->findOneBy(['nurse' => $nurse->getId()]);
        $feed = (new Feed())->setCreationDate(new \DateTime())->setText($text)->setNurse($nurse);

        $em = $this->doctrine->getManager();

        $em->persist($feed);
        $em->flush();

        return $feed;
    }

    public function handleFeedDelete(Feed $feed): void
    {
        $em = $this->doctrine->getManager();

        foreach ($feed->getFeedImages() as $feedImage) {
            $em->remove($feedImage);
            $em->flush();
        }

        $em->remove($feed);
        $em->flush();
    }

    public function handleFeedUpdate(Request $request, Feed $feed): void
    {
        $data = $request->toArray();
        $feed->setText($data['text']);
        $em = $this->doctrine->getManager();
        $em->flush();
    }
}
