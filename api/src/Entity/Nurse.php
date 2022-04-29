<?php

namespace App\Entity;

use App\Repository\NurseRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: NurseRepository::class)]
class Nurse
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['chat_list'])]
    private $id;

    #[ORM\OneToOne(targetEntity: User::class, cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['gallery', 'chat_list'])]
    private $nurse;

    #[ORM\OneToMany(mappedBy: 'nurse', targetEntity: Kid::class, orphanRemoval: true)]
    private $kids;

    #[ORM\OneToMany(mappedBy: 'nurse', targetEntity: Gallery::class)]
    private $galleries;

    #[ORM\OneToMany(mappedBy: 'nurse', targetEntity: Menu::class)]
    private $menus;

    #[ORM\OneToMany(mappedBy: 'nurse', targetEntity: Chat::class)]
    private $chats;

    public function __construct()
    {
        $this->kids = new ArrayCollection();
        $this->galleries = new ArrayCollection();
        $this->menus = new ArrayCollection();
        $this->chats = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNurse(): ?User
    {
        return $this->nurse;
    }

    public function setNurse(User $nurse): self
    {
        $this->nurse = $nurse;

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
            $kid->setNurse($this);
        }

        return $this;
    }

    public function removeKid(Kid $kid): self
    {
        if ($this->kids->removeElement($kid)) {
            // set the owning side to null (unless already changed)
            if ($kid->getNurse() === $this) {
                $kid->setNurse(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Gallery>
     */
    public function getGalleries(): Collection
    {
        return $this->galleries;
    }

    public function addGallery(Gallery $gallery): self
    {
        if (!$this->galleries->contains($gallery)) {
            $this->galleries[] = $gallery;
            $gallery->setNurse($this);
        }

        return $this;
    }

    public function removeGallery(Gallery $gallery): self
    {
        if ($this->galleries->removeElement($gallery)) {
            // set the owning side to null (unless already changed)
            if ($gallery->getNurse() === $this) {
                $gallery->setNurse(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Menu>
     */
    public function getMenus(): Collection
    {
        return $this->menus;
    }

    public function addMenu(Menu $menu): self
    {
        if (!$this->menus->contains($menu)) {
            $this->menus[] = $menu;
            $menu->setNurse($this);
        }

        return $this;
    }

    public function removeMenu(Menu $menu): self
    {
        if ($this->menus->removeElement($menu)) {
            // set the owning side to null (unless already changed)
            if ($menu->getNurse() === $this) {
                $menu->setNurse(null);
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
            $chat->setNurse($this);
        }

        return $this;
    }

    public function removeChat(Chat $chat): self
    {
        if ($this->chats->removeElement($chat)) {
            // set the owning side to null (unless already changed)
            if ($chat->getNurse() === $this) {
                $chat->setNurse(null);
            }
        }

        return $this;
    }
}
