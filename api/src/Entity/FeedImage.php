<?php

namespace App\Entity;

use App\Repository\FeedImageRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FeedImageRepository::class)]
class FeedImage
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['feed'])]
    private int $id;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['feed'])]
    private string $url;

    #[ORM\ManyToOne(targetEntity: Feed::class, inversedBy: 'feedImages')]
    private Feed $feed;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): self
    {
        $this->url = $url;

        return $this;
    }

    public function getFeed(): ?Feed
    {
        return $this->feed;
    }

    public function setFeed(?Feed $feed): self
    {
        $this->feed = $feed;

        return $this;
    }
}
