<?php

namespace App\Security;

use App\Entity\Kid;
use App\Entity\User;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class NurseVoter extends Voter
{
    const OWNER = 'owner';

    protected function supports(string $attribute, $subject): bool
    {
        if ($attribute != self::OWNER) {
            return false;
        }

        if (!$subject instanceof Kid) {
            return false;
        }

        return true;
    }

    /**
     * @throws Exception
     */
    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        return $this->canHandleKid($subject, $user);
    }

    /**
     * @param Kid $kid
     * @param User $user
     * @return bool
     */
    private function canHandleKid(Kid $kid, User $user): bool
    {
        if ($kid->getNurse()->getNurse()->getId() !== $user->getId() && $kid->getFamily()->getParent()->getId() !== $user->getId()) {
            throw new AccessDeniedHttpException("You can't do this", null, 404);
        }

        return true;
    }
}