<?php

namespace App\Entity;

use App\Repository\MessageRepository;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MessageRepository::class)]
class Message
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['chat'])]
    private int $id;

    #[ORM\Column(type: 'text')]
    #[Groups(['chat'])]
    private string $message;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'messages')]
    #[Groups(['chat'])]
    private User $user;

    #[ORM\ManyToOne(targetEntity: Chat::class, inversedBy: 'messages')]
    private Chat $chat;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['chat'])]
    private DateTimeInterface $sendDate;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getChat(): ?Chat
    {
        return $this->chat;
    }

    public function setChat(?Chat $chat): self
    {
        $this->chat = $chat;

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
