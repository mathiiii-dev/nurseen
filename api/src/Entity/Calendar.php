<?php

namespace App\Entity;

use App\Repository\CalendarRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CalendarRepository::class)]
class Calendar
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'date')]
    private $day;

    #[ORM\Column(type: 'time')]
    private $arrival;

    #[ORM\Column(type: 'time')]
    private $departure;

    #[ORM\ManyToOne(targetEntity: Kid::class, inversedBy: 'calendars')]
    #[ORM\JoinColumn(nullable: false)]
    private $kid;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDay(): ?\DateTimeInterface
    {
        return $this->day;
    }

    public function setDay(\DateTimeInterface $day): self
    {
        $this->day = $day;

        return $this;
    }

    public function getArrival(): ?\DateTimeInterface
    {
        return $this->arrival;
    }

    public function setArrival(\DateTimeInterface $arrival): self
    {
        $this->arrival = $arrival;

        return $this;
    }

    public function getDeparture(): ?\DateTimeInterface
    {
        return $this->departure;
    }

    public function setDeparture(\DateTimeInterface $departure): self
    {
        $this->departure = $departure;

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
