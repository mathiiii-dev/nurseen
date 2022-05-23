<?php

namespace App\Entity;

use App\Repository\FileRepository;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FileRepository::class)]
class File
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['file'])]
    private int $id;

    #[ORM\Column(type: 'text')]
    #[Groups(['file'])]
    private string $url;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'files')]
    #[Groups(['file'])]
    private User $sender;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'files')]
    #[Groups(['file'])]
    private User $recipient;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['file'])]
    private string $name;

    #[ORM\Column(type: 'date')]
    #[Groups(['file'])]
    private DateTimeInterface $sendDate;

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

    public function getSender(): ?User
    {
        return $this->sender;
    }

    public function setSender(?User $sender): self
    {
        $this->sender = $sender;

        return $this;
    }

    public function getRecipient(): ?User
    {
        return $this->recipient;
    }

    public function setRecipient(?User $recipient): self
    {
        $this->recipient = $recipient;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getSendDate(): ?DateTimeInterface
    {
        return $this->sendDate;
    }

    public function setSendDate(DateTimeInterface $sendDate): self
    {
        $this->sendDate = $sendDate;

        return $this;
    }
}
