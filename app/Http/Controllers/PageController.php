<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PageController extends Controller
{
    /**
     * Show the About page.
     */
    public function showAboutPage()
    {
        return Inertia::render('About');
    }
}
