<?php

namespace App\Service;

use Pagerfanta\Adapter;
use Pagerfanta\Pagerfanta;
use Symfony\Component\HttpFoundation\Request;

class PaginationService
{
    public function getPagination(Request $request, $object, $maxPerPage = 10): Pagerfanta
    {
        $page = $request->query->get('page') ?? 1;
        $pagerfanta = new Pagerfanta(
            new Adapter\ArrayAdapter($object)
        );

        $pagerfanta->setMaxPerPage($maxPerPage);
        $pagerfanta->setCurrentPage($page);

        return $pagerfanta;
    }
}
