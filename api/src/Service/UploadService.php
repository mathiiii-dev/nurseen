<?php

namespace App\Service;

use Exception;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class UploadService
{
    private SluggerInterface $slugger;

    public function __construct(SluggerInterface $slugger)
    {
        $this->slugger = $slugger;
    }

    public function getFileName(UploadedFile $file): string
    {
        $safeFilename = $this->slugger->slug($file->getClientOriginalName());
        return $safeFilename.'-'.uniqid().'.'.$file->guessExtension();
    }

    /**
     * @throws Exception
     */
    public function uploadFile(UploadedFile $file, string $directory, string $fileName): void
    {
        try {
            $file->move($directory, $fileName);
        } catch (FileException $e) {
            throw new Exception($e->getMessage());
        }
    }
}
