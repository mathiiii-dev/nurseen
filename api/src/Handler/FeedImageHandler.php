<?php

namespace App\Handler;

use App\Entity\Feed;
use App\Entity\FeedImage;
use App\Service\UploadService;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\String\Slugger\SluggerInterface;

class FeedImageHandler
{
    private SluggerInterface $slugger;
    private ManagerRegistry $doctrine;
    private ParameterBagInterface $bag;
    private UploadService $uploadService;

    public function __construct(SluggerInterface $slugger, ManagerRegistry $doctrine, ParameterBagInterface $bag, UploadService $uploadService)
    {
        $this->slugger = $slugger;
        $this->doctrine = $doctrine;
        $this->bag = $bag;
        $this->uploadService = $uploadService;
    }

    public function handleFeedImageCreate($files, Feed $feed)
    {
        $em = $this->doctrine->getManager();

        foreach ($files as $file) {
            $fileName = $this->uploadService->getFileName($file);

            $feedImage = (new FeedImage())->setUrl($fileName)->setFeed($feed);

            $em->persist($feedImage);
            $em->flush();

            $this->uploadService->uploadFile($file, $this->bag->get('feed_directory').'/'.$feed->getId(), $fileName);
        }
    }
}
