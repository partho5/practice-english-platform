<?php

namespace App\Services\Speaking;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OneSignalService
{
    private string $appId;
    private string $restApiKey;
    private string $apiUrl = 'https://onesignal.com/api/v1/notifications';

    public function __construct()
    {
        $this->appId = config('services.onesignal.app_id');
        $this->restApiKey = config('services.onesignal.rest_api_key');
    }

    /**
     * Send push notification to specific player IDs
     *
     * @param array $playerIds Array of OneSignal player IDs
     * @param string $message Notification message
     * @param array $data Additional data to send with notification
     * @return array ['success' => bool, 'response' => array, 'error' => string|null]
     */
    public function sendPushNotification(array $playerIds, string $message, array $data = []): array
    {
        if (empty($playerIds)) {
            return [
                'success' => false,
                'response' => null,
                'error' => 'No player IDs provided'
            ];
        }

        try {
            $payload = [
                'app_id' => $this->appId,
                'include_player_ids' => $playerIds,
                'contents' => ['en' => $message],
                'headings' => ['en' => 'Speaking Practice Request'],
                'url' => url('/speaking/partners'), // Redirect on click
            ];

            // Add custom data if provided
            if (!empty($data)) {
                $payload['data'] = $data;
            }

            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . $this->restApiKey,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl, $payload);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'response' => $response->json(),
                    'error' => null
                ];
            }

            // Log failed response
            Log::error('OneSignal API Error', [
                'status' => $response->status(),
                'body' => $response->body(),
                'player_ids' => $playerIds
            ]);

            return [
                'success' => false,
                'response' => $response->json(),
                'error' => $response->body()
            ];

        } catch (\Exception $e) {
            Log::error('OneSignal Exception', [
                'message' => $e->getMessage(),
                'player_ids' => $playerIds
            ]);

            return [
                'success' => false,
                'response' => null,
                'error' => $e->getMessage()
            ];
        }
    }
}
