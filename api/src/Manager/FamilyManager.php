<?php

namespace App\Manager;

use App\Entity\Kid;
use App\Entity\Nurse;
use JetBrains\PhpStorm\ArrayShape;

class FamilyManager
{
    public function getFamilyNurse(Nurse $nurse): array
    {
        $parents = [];
        /**
         * @var $kid Kid
         */
        foreach ($nurse->getKids()->toArray() as $kid) {
            if (0 === $kid->getFamily()->getChats()->count()) {
                $parents[] = [
                    'name' => $kid->getFamily()->getParent()->getFirstname().' '.$kid->getFamily()->getParent()->getLastname(),
                    'id' => $kid->getFamily()->getParent()->getId(),
                ];
            }
        }

        return array_values(array_unique($parents, SORT_REGULAR));
    }

    public function getFamilyNurseList(Nurse $nurse): array
    {
        $parents = [];
        /**
         * @var $kid Kid
         */
        foreach ($nurse->getKids()->toArray() as $kid) {
            $parents[] = [
                'name' => $kid->getFamily()->getParent()->getFirstname().' '.$kid->getFamily()->getParent()->getLastname(),
                'id' => $kid->getFamily()->getParent()->getId(),
            ];
        }

        return array_values(array_unique($parents, SORT_REGULAR));
    }

    public function getNurse(Nurse $nurse): array
    {
        return [
            'userId' => $nurse->getNurse()->getId(),
            'lastname' => $nurse->getNurse()->getLastname(),
            'firstname' => $nurse->getNurse()->getFirstname(),
        ];
    }
}
