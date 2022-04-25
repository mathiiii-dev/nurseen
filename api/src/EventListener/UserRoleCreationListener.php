<?php

namespace App\EventListener;

use App\Entity\User;
use App\Handler\FamilyHandler;
use App\Handler\NurseHandler;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class UserRoleCreationListener
{
    private NurseHandler $nurseHandler;
    private FamilyHandler $familyHandler;

    public function __construct(NurseHandler $nurseHandler, FamilyHandler $familyHandler)
    {
        $this->nurseHandler = $nurseHandler;
        $this->familyHandler = $familyHandler;
    }

    public function postPersist(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if(!$entity instanceof User) {
            return;
        }

        $role = $entity->getRoles();

        if($role[0] === 'ROLE_NURSE') {
            $this->nurseHandler->handleNurseCreate($entity);
        } elseif($role[0] === 'ROLE_PARENT') {
            $this->familyHandler->handleFamilyCreate($entity);
        }
    }
}