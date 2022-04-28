<?php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ExceptionListener
{
    public function onKernelException(ExceptionEvent $event)
    {
        $exception = $event->getThrowable();

        $response = new JsonResponse();
        $data = [
            'error' => 'error',
            'error_description' => $exception->getMessage(),
        ];

        if ($exception instanceof NotFoundHttpException) {
            $data = [
                'error' => 'not_found',
                'error_description' => $exception->getMessage(),
            ];
        }

        if ($exception instanceof BadRequestHttpException) {
            $data = [
                'error' => 'invalid_request',
                'error_description' => $exception->getMessage(),
            ];
        }

        if ($exception instanceof AccessDeniedHttpException) {
            $data = [
                'error' => 'not_allowed',
                'error_description' => $exception->getMessage(),
            ];
        }

        $response->setData($data);
        $event->setResponse($response);
    }
}
