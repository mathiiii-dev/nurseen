<?php

namespace App\Controller;

use App\Entity\User;
use App\Handler\UserHandler;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class UserController extends AbstractController
{
    private UserHandler $userHandler;

    public function __construct(UserHandler $userHandler)
    {
        $this->userHandler = $userHandler;
    }

    #[Route('/user', name: 'user_create', methods: 'POST')]
    public function userCreate(Request $request): JsonResponse|Response
    {
        try {
            $this->userHandler->handleUserCreate($request);
            return new JsonResponse([], Response::HTTP_CREATED);
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage(), $exception->getCode());
        }
    }

    #[Route('/login', name: 'user_login', methods: 'POST')]
    public function userLogin(#[CurrentUser] ?User $user): JsonResponse
    {
        if (null === $user) {
            return $this->json([
                'message' => 'missing credentials',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'user' => $user->getUserIdentifier(),
            'token' => 'token',
        ]);
    }
}
