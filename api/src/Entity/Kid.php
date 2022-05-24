<?php

namespace App\Entity;

use App\Repository\KidRepository;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: KidRepository::class)]
class Kid
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['kid_list'])]
    private int $id;

    #[ORM\Column(type: 'string', length: 50)]
    #[Groups(['kid_list'])]
    private string $firstname;

    #[ORM\Column(type: 'string', length: 50)]
    #[Groups(['kid_list'])]
    private string $lastname;

    #[ORM\Column(type: 'date', nullable: true)]
    #[Groups(['kid_list'])]
    private DateTimeInterface $birthday;

    #[ORM\ManyToOne(targetEntity: Family::class, inversedBy: 'kids')]
    #[ORM\JoinColumn(nullable: false)]
    private Family $family;

    #[ORM\ManyToOne(targetEntity: Nurse::class, inversedBy: 'kids')]
    #[ORM\JoinColumn(nullable: false)]
    private Nurse $nurse;

    #[ORM\Column(type: 'boolean')]
    #[Groups(['kid_list'])]
    private bool $archived;

    #[ORM\Column(type: 'boolean')]
    #[Groups(['kid_list'])]
    private bool $activated;

    #[ORM\OneToMany(mappedBy: 'kid', targetEntity: Calendar::class, orphanRemoval: true)]
    private Collection $calendars;

    #[ORM\OneToMany(mappedBy: 'kid', targetEntity: Note::class)]
    private Collection $notes;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups(['kid_list'])]
    private string $color;

    public function __construct()
    {
        $this->calendars = new ArrayCollection();
        $this->notes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getBirthday(): ?DateTimeInterface
    {
        return $this->birthday;
    }

    public function setBirthday(?DateTimeInterface $birthday): self
    {
        $this->birthday = $birthday;

        return $this;
    }

    public function getFamily(): ?Family
    {
        return $this->family;
    }

    public function setFamily(?Family $family): self
    {
        $this->family = $family;

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

    public function getArchived(): ?bool
    {
        return $this->archived;
    }

    public function setArchived(bool $archived): self
    {
        $this->archived = $archived;

        return $this;
    }

    public function getActivated(): ?bool
    {
        return $this->activated;
    }

    public function setActivated(bool $activated): self
    {
        $this->activated = $activated;

        return $this;
    }

    /**
     * @return Collection<int, Calendar>
     */
    public function getCalendars(): Collection
    {
        return $this->calendars;
    }

    public function addCalendar(Calendar $calendar): self
    {
        if (!$this->calendars->contains($calendar)) {
            $this->calendars[] = $calendar;
            $calendar->setKid($this);
        }

        return $this;
    }

    public function removeCalendar(Calendar $calendar): self
    {
        if ($this->calendars->removeElement($calendar)) {
            // set the owning side to null (unless already changed)
            if ($calendar->getKid() === $this) {
                $calendar->setKid(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Note>
     */
    public function getNotes(): Collection
    {
        return $this->notes;
    }

    public function addNote(Note $note): self
    {
        if (!$this->notes->contains($note)) {
            $this->notes[] = $note;
            $note->setKid($this);
        }

        return $this;
    }

    public function removeNote(Note $note): self
    {
        if ($this->notes->removeElement($note)) {
            // set the owning side to null (unless already changed)
            if ($note->getKid() === $this) {
                $note->setKid(null);
            }
        }

        return $this;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(?string $color): self
    {
        $this->color = $color;

        return $this;
    }
}
