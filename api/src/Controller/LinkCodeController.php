<?php

namespace App\Controller;

use App\Entity\User;
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
    public function index(User $nurse): JsonResponse
    {
        $this->denyAccessUnlessGranted('owner', $nurse);
        try {
            $code = $this->codeHandler->handleLinkeCodeCreate($nurse);

            return new JsonResponse(['code' => $code], Response::HTTP_CREATED);
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(), $exception->getCode());
        }
    }

    #[Route('/link_code/{nurse}', name: 'app_link_code_get', methods: 'GET')]
    #[IsGranted('ROLE_NURSE', message: 'Vous ne pouvez pas faire ça')]
    public function get(User $nurse): JsonResponse
    {
        $this->denyAccessUnlessGranted('owner', $nurse);
        return $this->json(['code' => $this->codeHandler->getNurseLinkCode($nurse->getId())], Response::HTTP_OK);
    }
}
