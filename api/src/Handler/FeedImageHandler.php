<?php

namespace App\Handler;

use App\Entity\Feed;
use App\Entity\FeedImage;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\String\Slugger\SluggerInterface;

class FeedImageHandler
{
    private SluggerInterface $slugger;
    private ManagerRegistry $doctrine;
    private ParameterBagInterface $bag;

    public function __construct(SluggerInterface $slugger, ManagerRegistry $doctrine, ParameterBagInterface $bag)
    {
        $this->slugger = $slugger;
        $this->doctrine = $doctrine;
        $this->bag = $bag;
    }

    public function handleFeedImageCreate($files, Feed $feed)
    {
        $em = $this->doctrine->getManager();

        foreach ($files as $file) {
            $safeFilename = $this->slugger->slug($file->getClientOriginalName());
            $fileName = $safeFilename.'-'.uniqid().'.'.$file->guessExtension();

            $feedImage = (new FeedImage())->setUrl($fileName)->setFeed($feed);

            $em->persist($feedImage);
            $em->flush();

            try {
                $file->move($this->bag->get('feed_directory').'/'.$feed->getId(), $fileName);
            } catch (FileException $e) {
                throw new \Exception($e->getMessage());
            }
        }
    }
}
