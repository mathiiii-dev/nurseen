<?php

namespace App\EventListener;

use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JWTCreatedListener
{
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function onJWTCreated(JWTCreatedEvent $event): void
    {
        $payload = $event->getData();
        $user = $this->userRepository->findOneBy(['email' => $event->getUser()->getUserIdentifier()]);

        $payload['id'] = $user->getId();
        $payload['firstname'] = $user->getFirstname();
        $payload['lastname'] = $user->getLastname();
        $payload['mercure'] = [
            'publish' => ['*'],
        ];

        $event->setData($payload);

        $header = $event->getHeader();
        $header['cty'] = 'JWT';

        $event->setHeader($header);
    }
}
