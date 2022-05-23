<?php

namespace App\Entity;

use App\Repository\NoteRepository;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: NoteRepository::class)]
class Note
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['note_list'])]
    private int $id;

    #[Groups(['note_list'])]
    #[ORM\Column(type: 'text')]
    private string $note;

    #[Groups(['note_list'])]
    #[ORM\Column(type: 'date')]
    private DateTimeInterface $date;

    #[ORM\ManyToOne(targetEntity: Kid::class, inversedBy: 'note')]
    private Kid $kid;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNote(): ?string
    {
        return $this->note;
    }

    public function setNote(string $note): self
    {
        $this->note = $note;

        return $this;
    }

    public function getDate(): ?DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getKid(): ?Kid
    {
        return $this->kid;
    }

    public function setKid(?Kid $kid): self
    {
        $this->kid = $kid;

        return $this;
    }
}
