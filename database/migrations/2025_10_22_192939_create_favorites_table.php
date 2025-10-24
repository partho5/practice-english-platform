<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('favorite_user_id')->constrained('users')->onDelete('cascade');
            $table->string('category')->default('general');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Ensure a user can't favorite themselves
            $table->unique(['user_id', 'favorite_user_id']);
            
            // Indexes
            $table->index(['user_id', 'category']);
            $table->index('favorite_user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};