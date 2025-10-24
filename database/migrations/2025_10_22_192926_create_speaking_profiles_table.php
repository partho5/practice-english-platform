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
        Schema::create('speaking_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Core profile data
            $table->enum('purpose_of_practice', ['IELTS', 'TOEFL', 'Fluency', 'Other'])->default('IELTS');
            $table->string('expected_score')->nullable();
            $table->string('education')->default('');
            $table->string('institution')->default('');
            $table->string('district')->default('');
            $table->string('city')->default('');
            $table->text('career_plan')->default('');
            
            // Media
            $table->string('profile_picture')->nullable();
            $table->string('voice_intro_url')->nullable();
            $table->string('youtube_video_url')->nullable();
            
            // Availability & preferences
            $table->string('timezone')->nullable();
            $table->json('available_hours')->nullable(); // ["morning", "evening"]
            $table->json('preferred_days')->nullable(); // ["weekdays", "weekends"]
            $table->enum('skill_level', ['Beginner', 'Intermediate', 'Advanced'])->default('Intermediate');
            $table->string('native_language')->nullable();
            $table->json('interests')->nullable(); // ["music", "travel", "technology"]
            
            // Status
            $table->boolean('is_online')->default(false);
            $table->boolean('is_available')->default(true);
            $table->boolean('is_verified')->default(false);
            $table->timestamp('last_active_at')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['purpose_of_practice', 'is_available']);
            $table->index(['city', 'district']);
            $table->index(['skill_level', 'purpose_of_practice']);
            $table->index('last_active_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('speaking_profiles');
    }
};