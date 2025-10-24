<?php

use App\Http\Controllers\Speaking\ProfileController;
use App\Http\Controllers\Speaking\PartnerController;
use Illuminate\Support\Facades\Route;

Route::prefix('speaking')->name('speaking.')->group(function () {
    // Profile routes
    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::get('/profile/view', [ProfileController::class, 'show'])->name('profile.show');
        Route::patch('/profile/status', [ProfileController::class, 'updateStatus'])->name('profile.status');
        
        // Partner routes
        Route::get('/partners', [PartnerController::class, 'index'])->name('partners.index');
        Route::get('/partners/favorites', [PartnerController::class, 'favorites'])->name('partners.favorites');
        Route::get('/partners/{partner}', [PartnerController::class, 'show'])->name('partners.show');
        Route::post('/partners/{partner}/favorite', [PartnerController::class, 'addToFavorites'])->name('partners.favorite');
        Route::delete('/partners/{partner}/favorite', [PartnerController::class, 'removeFromFavorites'])->name('partners.unfavorite');
    });
});
