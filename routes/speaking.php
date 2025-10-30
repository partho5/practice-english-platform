<?php

use App\Http\Controllers\Speaking\ProfileController;
use App\Http\Controllers\Speaking\PartnerController;
use App\Http\Controllers\Speaking\NotificationController;
use Illuminate\Support\Facades\Route;

Route::prefix('speaking')->name('speaking.')->group(function () {
    // Notification routes (can be used without auth for subscribe)
    Route::match(['get', 'post'], '/subscribe', [NotificationController::class, 'subscribe'])->name('subscribe');
    Route::post('/notification', [NotificationController::class, 'sendNotification'])->name('notification');

    // Authenticated routes
    Route::middleware('auth')->group(function () {
        // Profile routes
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::get('/profile/view', [ProfileController::class, 'show'])->name('profile.show');
        Route::patch('/profile/status', [ProfileController::class, 'updateStatus'])->name('profile.status');

        // Partner routes with tabs
        Route::get('/partners/{tab?}', [PartnerController::class, 'index'])
            ->where('tab', 'received|sent|favorites')
            ->name('partners.index');

        // Partner detail and actions (must come after tab routes to avoid conflicts)
        Route::get('/partners/view/{partner}', [PartnerController::class, 'show'])->name('partners.show');
        Route::post('/partners/view/{partner}/favorite', [PartnerController::class, 'addToFavorites'])->name('partners.favorite');
        Route::delete('/partners/view/{partner}/favorite', [PartnerController::class, 'removeFromFavorites'])->name('partners.unfavorite');

        // Connection request routes
        Route::post('/partners/view/{partner}/connect', [PartnerController::class, 'sendConnectionRequest'])->name('partners.connect');
        Route::patch('/connections/{connectionId}/status', [PartnerController::class, 'updateConnectionStatus'])->name('connections.update-status');
    });
});
