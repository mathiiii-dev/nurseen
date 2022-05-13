<?php

namespace App\Service;

use Symfony\Component\Mercure\Update;
use Symfony\Component\Messenger\MessageBusInterface;

class MercureService
{
    private MessageBusInterface $bus;

    public function __construct(MessageBusInterface $bus)
    {
        $this->bus = $bus;
    }

    public function update(string $topics, string $data)
    {
        $update = new Update(
            $topics,
            $data
        );
        $this->bus->dispatch($update);
    }
}
