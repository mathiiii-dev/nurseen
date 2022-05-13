<?php

namespace App\Service;

use Pagerfanta\Adapter;
use Pagerfanta\Pagerfanta;
use Symfony\Component\HttpFoundation\Request;

class PaginationService
{
    public function getPagination(Request $request, $object): Pagerfanta
    {
        $pagerfanta = new Pagerfanta(
            new Adapter\ArrayAdapter($object)
        );

        $pagerfanta->setCurrentPage($request->query->get('page'));

        return $pagerfanta;
    }
}
