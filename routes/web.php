<?php

use App\Http\Controllers\Controller;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Speaking\NotificationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ProfileController::class, 'showHomepage']);
Route::get('/about', [PageController::class, 'showAboutPage']);



Route::prefix('speaking')->group(function () {
    Route::match(['get', 'post'],'/subscribe', [NotificationController::class, 'subscribe'])->name('speaking.subscribe');
    Route::post('/notification', [NotificationController::class, 'sendNotification'])->name('speaking.notification');

    // Requests page (create controller method later)
    Route::get('/requests', function () {
        return Inertia::render('Speaking/Requests');
    })->name('speaking.requests');
});



Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
require __DIR__.'/speaking.php';
