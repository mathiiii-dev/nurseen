<?php

namespace App\Entity;

use App\Repository\FamilyRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FamilyRepository::class)]
class Family
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['chat_list'])]
    private $id;

    #[ORM\OneToOne(targetEntity: User::class, cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private $parent;

    #[ORM\OneToMany(mappedBy: 'family', targetEntity: Kid::class, orphanRemoval: true)]
    private $kids;

    #[ORM\OneToMany(mappedBy: 'family', targetEntity: Chat::class)]
    private $chats;

    public function __construct()
    {
        $this->kids = new ArrayCollection();
        $this->chats = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getParent(): ?User
    {
        return $this->parent;
    }

    public function setParent(User $parent): self
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * @return Collection<int, Kid>
     */
    public function getKids(): Collection
    {
        return $this->kids;
    }

    public function addKid(Kid $kid): self
    {
        if (!$this->kids->contains($kid)) {
            $this->kids[] = $kid;
            $kid->setFamily($this);
        }

        return $this;
    }

    public function removeKid(Kid $kid): self
    {
        if ($this->kids->removeElement($kid)) {
            // set the owning side to null (unless already changed)
            if ($kid->getFamily() === $this) {
                $kid->setFamily(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Chat>
     */
    public function getChats(): Collection
    {
        return $this->chats;
    }

    public function addChat(Chat $chat): self
    {
        if (!$this->chats->contains($chat)) {
            $this->chats[] = $chat;
            $chat->setFamily($this);
        }

        return $this;
    }

    public function removeChat(Chat $chat): self
    {
        if ($this->chats->removeElement($chat)) {
            // set the owning side to null (unless already changed)
            if ($chat->getFamily() === $this) {
                $chat->setFamily(null);
            }
        }

        return $this;
    }
}
