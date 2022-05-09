<?php

namespace App\Entity;

use App\Repository\FeedRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FeedRepository::class)]
class Feed
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['feed'])]
    private $id;

    #[ORM\Column(type: 'text')]
    #[Groups(['feed'])]
    private $text;

    #[ORM\Column(type: 'date')]
    #[Groups(['feed'])]
    private $creationDate;

    #[ORM\ManyToOne(targetEntity: Nurse::class, inversedBy: 'feeds')]
    #[Groups(['feed'])]
    private $nurse;

    #[ORM\OneToMany(mappedBy: 'feed', targetEntity: FeedImage::class)]
    private $feedImages;

    public function __construct()
    {
        $this->feedImages = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): self
    {
        $this->text = $text;

        return $this;
    }

    public function getCreationDate(): ?\DateTimeInterface
    {
        return $this->creationDate;
    }

    public function setCreationDate(\DateTimeInterface $creationDate): self
    {
        $this->creationDate = $creationDate;

        return $this;
    }

    public function getNurse(): ?Nurse
    {
        return $this->nurse;
    }

    public function setNurse(?Nurse $nurse): self
    {
        $this->nurse = $nurse;

        return $this;
    }

    /**
     * @return Collection<int, FeedImage>
     */
    public function getFeedImages(): Collection
    {
        return $this->feedImages;
    }

    public function addFeedImage(FeedImage $feedImage): self
    {
        if (!$this->feedImages->contains($feedImage)) {
            $this->feedImages[] = $feedImage;
            $feedImage->setFeed($this);
        }

        return $this;
    }

    public function removeFeedImage(FeedImage $feedImage): self
    {
        if ($this->feedImages->removeElement($feedImage)) {
            // set the owning side to null (unless already changed)
            if ($feedImage->getFeed() === $this) {
                $feedImage->setFeed(null);
            }
        }

        return $this;
    }
}
