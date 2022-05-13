<?php

namespace App\Handler;

use App\Entity\User;
use App\Service\ValidatorService;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class UserHandler
{
    private UserPasswordHasherInterface $passwordHasher;
    private array $encoders;
    /**
     * @var ObjectNormalizer[]
     */
    private array $normalizers;
    private Serializer $serializer;
    private ManagerRegistry $doctrine;
    private ValidatorService $validator;

    public function __construct(UserPasswordHasherInterface $passwordHasher, ManagerRegistry $doctrine, ValidatorService $validator)
    {
        $this->passwordHasher = $passwordHasher;
        $this->encoders = [new XmlEncoder(), new JsonEncoder()];
        $this->normalizers = [new ObjectNormalizer()];
        $this->serializer = new Serializer($this->normalizers, $this->encoders);
        $this->doctrine = $doctrine;
        $this->validator = $validator;
    }

    public function handleUserCreate(Request $request)
    {
        $entityManager = $this->doctrine->getManager();
        $user = $this->serializer->denormalize(json_decode($request->getContent()), User::class);
        $this->validator->validate($user);
        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $user->getPassword()
        );
        $user->setPassword($hashedPassword);

        $entityManager->persist($user);

        $entityManager->flush();
    }
}
