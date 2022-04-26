<?php

namespace App\Entity;

use App\Repository\MenuRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MenuRepository::class)]
class Menu
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['menu'])]
    private $id;

    #[Groups(['menu'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $entry;

    #[Groups(['menu'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $meal;

    #[Groups(['menu'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $dessert;

    #[Groups(['menu'])]
    #[ORM\Column(type: 'date')]
    private $date;

    #[ORM\ManyToOne(targetEntity: Nurse::class, inversedBy: 'menus')]
    private $nurse;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEntry(): ?string
    {
        return $this->entry;
    }

    public function setEntry(string $entry): self
    {
        $this->entry = $entry;

        return $this;
    }

    public function getMeal(): ?string
    {
        return $this->meal;
    }

    public function setMeal(string $meal): self
    {
        $this->meal = $meal;

        return $this;
    }

    public function getDessert(): ?string
    {
        return $this->dessert;
    }

    public function setDessert(string $dessert): self
    {
        $this->dessert = $dessert;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

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
