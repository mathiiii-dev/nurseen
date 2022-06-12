<?php

namespace App\Service;

use Cloudinary\Api\ApiResponse;
use Cloudinary\Cloudinary;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class CloudinaryService
{
    private ParameterBagInterface $parameterBag;

    public function __construct(ParameterBagInterface $parameterBag)
    {
        $this->parameterBag = $parameterBag;
    }

    private function getCloudinary(): Cloudinary
    {
        return new Cloudinary($this->parameterBag->get('cloudinary_url'));
    }

    public function delete(string $public_id): ApiResponse
    {
        return $this->getCloudinary()->uploadApi()->destroy($public_id, ['resource_type' => 'image']);
    }
}
