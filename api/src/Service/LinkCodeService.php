<?php

namespace App\Service;

use App\Entity\Nurse;
use App\Repository\LinkCodeRepository;

class LinkCodeService
{

    private LinkCodeRepository $codeRepository;

    public function __construct(LinkCodeRepository $codeRepository)
    {
        $this->codeRepository = $codeRepository;
    }

    public function validate(int $code): ?Nurse
    {
        $code = $this->codeRepository->findOneBy(['code' => $code]);
        if (!$code) {
            throw new \Exception(
                'No code found',
                404
            );
        }

        if(new \DateTime() > $code->getExpiration()) {
            throw new \Exception(
                'Code expired! Get a new one',
                401
            );
        }

        return $code->getNurse();
    }

}