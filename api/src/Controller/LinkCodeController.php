<?php

namespace App\Controller;

use App\Handler\LinkCodeHandler;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LinkCodeController extends AbstractController
{
    private LinkCodeHandler $codeHandler;

    public function __construct(LinkCodeHandler $codeHandler)
    {
        $this->codeHandler = $codeHandler;
    }

    #[Route('/link_code/{nurse}', name: 'app_link_code', methods: 'POST')]
    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    public function index(int $nurse): JsonResponse
    {
        try {
            $code = $this->codeHandler->handleLinkeCodeCreate($nurse);

            return new JsonResponse(['code' => $code], Response::HTTP_CREATED);
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(), $exception->getCode());
        }
    }

    #[Route('/link_code/{nurseId}', name: 'app_link_code_get', methods: 'GET')]
    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    public function get(int $nurseId): JsonResponse
    {
        return $this->json(['code' => $this->codeHandler->getNurseLinkCode($nurseId)], Response::HTTP_OK);
    }
}
