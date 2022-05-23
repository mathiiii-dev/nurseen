<?php

namespace App\Entity;

use App\Repository\GalleryRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: GalleryRepository::class)]
class Gallery
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['gallery'])]
    private int $id;

    #[Groups(['gallery'])]
    #[ORM\Column(type: 'text')]
    private string $url;

    #[Groups(['gallery'])]
    #[ORM\ManyToOne(targetEntity: Nurse::class, inversedBy: 'galleries')]
    private Nurse $nurse;

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

    public function getNurse(): ?Nurse
    {
        return $this->nurse;
    }

    public function setNurse(?Nurse $nurse): self
    {
        $this->nurse = $nurse;

        return $this;
    }
}
