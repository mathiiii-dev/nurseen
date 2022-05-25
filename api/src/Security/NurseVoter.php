<?php

namespace App\Security;

use App\Entity\Calendar;
use App\Entity\Chat;
use App\Entity\Feed;
use App\Entity\Kid;
use App\Entity\Menu;
use App\Entity\User;
use Exception;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class NurseVoter extends Voter
{
    public const OWNER = 'owner';

    protected function supports(string $attribute, mixed $subject): bool
    {
        if (self::OWNER != $attribute) {
            return false;
        }

        if (!$subject instanceof Kid && !$subject instanceof User && !$subject instanceof Feed
            && !$subject instanceof Calendar && !$subject instanceof Menu && !$subject instanceof Chat) {
            return false;
        }

        return true;
    }

    /**
     * @throws Exception
     */
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        if ($subject instanceof Kid) {
            return $this->canHandleKid($subject, $user);
        }

        if ($subject instanceof Feed) {
            return $this->canHandleFeed($subject, $user);
        }

        if ($subject instanceof Calendar) {
            return $this->canHandleCalendar($subject, $user);
        }

        if ($subject instanceof Menu) {
            return $this->canHandleMenu($subject, $user);
        }

        if ($subject instanceof Chat) {
            return $this->canHandleChat($subject, $user);
        }

        return $this->isUserNurse($subject, $user);
    }

    private function isUserNurse(User $nurse, User $user): bool
    {
        if ($nurse->getId() !== $user->getId()) {
            throw new AccessDeniedHttpException("You can't do this", null, 404);
        }

        return true;
    }

    private function canHandleFeed(Feed $feed, User $user): bool
    {
        if ($feed->getNurse()->getNurse()->getId() !== $user->getId()) {
            throw new AccessDeniedHttpException("You can't do this", null, 404);
        }

        return true;
    }

    private function canHandleChat(Chat $chat, User $user): bool
    {
        if ($chat->getNurse()->getNurse()->getId() !== $user->getId() || $chat->getFamily()->getParent()->getId() !== $user->getId()) {
            throw new AccessDeniedHttpException("You can't do this", null, 404);
        }

        return true;
    }

    private function canHandleMenu(Menu $menu, User $user): bool
    {
        if ($menu->getNurse()->getNurse()->getId() !== $user->getId()) {
            throw new AccessDeniedHttpException("You can't do this", null, 404);
        }

        return true;
    }

    private function canHandleCalendar(Calendar $calendar, User $user): bool
    {
        if ($calendar->getKid()->getNurse()->getNurse()->getId() !== $user->getId()) {
            throw new AccessDeniedHttpException("You can't do this", null, 404);
        }

        return true;
    }

    private function canHandleKid(Kid $kid, User $user): bool
    {
        if ($kid->getNurse()->getNurse()->getId() !== $user->getId() && $kid->getFamily()->getParent()->getId() !== $user->getId()) {
            throw new AccessDeniedHttpException("You can't do this", null, 404);
        }

        return true;
    }
}
