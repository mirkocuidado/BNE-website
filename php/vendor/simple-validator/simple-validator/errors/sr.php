<?php
/**
 * :attribute => input name
 * :params => rule parameters ( eg: :params(0) = 10 of max_length(10) )
 */
return array(
    'required' => ':attribute polje je obavezno',
    'integer' => ':attribute polje mora biti celobrojna vrednost',
    'float' => ':attribute polje mora biti decimalna vrednost',
    'numeric' => ':attribute polje mora biti brojna vrednost',
    'email' => ':attribute nije validna e-mail adresa',
    'alpha' => ':attribute polje mora biti alfa (samo slovni karakteri) vrednost',
    'alpha_numeric' => ':attribute polje mora biti alfanumerička (samo slova i brojevi) vrednost',
    'ip' => ':attribute polje mora biti validna IP adresa',
    'url' => ':attribute polje mora biti validna URL adresa',
    'max_length' => ':attribute polje može biti maksimalno :params(0) karaktera dugačko',
    'min_length' => ':attribute polje mora biti minimalno :params(0) karaktera dugačko',
    'exact_length' => ':attribute polje mora biti tačno :params(0) karaktera dugačko',
    'equals' => ':attribute polje mora biti isto kao i :params(0)'
);