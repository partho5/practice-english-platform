<?php

namespace App\Models\Speaking;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SpeakingPushSubscription extends Model
{
    protected $fillable = [
        'user_id',
        'player_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
