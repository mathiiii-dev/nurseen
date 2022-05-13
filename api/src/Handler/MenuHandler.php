<?php

namespace App\Handler;

use App\Entity\Menu;
use App\Entity\Nurse;
use DateTime;
use Doctrine\Persistence\ManagerRegistry;
use Exception;

class MenuHandler
{
    private ManagerRegistry $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * @throws Exception
     */
    public function handleMenuCreate(array $data, Nurse $nurse): void
    {
        $menu = (new Menu())
            ->setDate(new DateTime($data['date']))
            ->setDessert($data['dessert'])
            ->setEntry($data['entry'])
            ->setMeal($data['meal'])
            ->setNurse($nurse);

        $entityManager = $this->doctrine->getManager();

        $entityManager->persist($menu);
        $entityManager->flush();
    }

    /**
     * @throws Exception
     */
    public function handleMenuUpdate(Menu $menu, array $data)
    {
        $menu->setDate(new \DateTime($data['date']))
            ->setDessert($data['dessert'])
            ->setEntry($data['entry'])
            ->setMeal($data['meal']);

        $this->doctrine->getManager()->flush();
    }
}
