<?php

namespace App\Entity;

use App\Repository\LinkCodeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LinkCodeRepository::class)]
class LinkCode
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'integer')]
    private int $code;

    #[ORM\OneToOne(targetEntity: Nurse::class, cascade: ['persist', 'remove'])]
    private Nurse $nurse;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCode(): ?int
    {
        return $this->code;
    }

    public function setCode(int $code): self
    {
        $this->code = $code;

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
