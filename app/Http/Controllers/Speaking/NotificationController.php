<?php

namespace App\Http\Controllers\Speaking;

use App\helpers\AppData;
use App\Http\Controllers\Controller;
use App\Models\Speaking\ConnectionRequest;
use App\Models\Speaking\SpeakingPushSubscription;
use App\Models\SpeakingNotificationLog;
use App\Models\User;
use App\Services\Speaking\OneSignalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    private OneSignalService $oneSignalService;

    public function __construct(OneSignalService $oneSignalService)
    {
        $this->oneSignalService = $oneSignalService;
    }

    /**
     * Subscribe user to push notifications
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function subscribe(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'player_id' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid player ID',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $subscription = SpeakingPushSubscription::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'player_id' => $request->player_id,
                ],
                [
                    'user_id' => Auth::id(),
                    'player_id' => $request->player_id,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Subscription saved successfully',
                'data' => $subscription
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save subscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send notification to target user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendNotification(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'target_user_id' => 'required|integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid target user',
                'errors' => $validator->errors()
            ], 422);
        }

        $senderId = Auth::id();
        $receiverId = $request->target_user_id;

        // Prevent sending to self
        if ($senderId === $receiverId) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot send notification to yourself'
            ], 400);
        }

        try {
            // Get sender info for personalized message
            $sender = User::findOrFail($senderId);

            // Get all player IDs for the target user
            $playerIds = SpeakingPushSubscription::where('user_id', $receiverId)
                ->pluck('player_id')
                ->toArray();

            if (empty($playerIds)) {
                // Log failed attempt
                SpeakingNotificationLog::create([
                    'sender_id' => $senderId,
                    'receiver_id' => $receiverId,
                    'player_ids_sent' => [],
                    'status' => 'failed',
                    'error_message' => 'User has not enabled notifications'
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'User has not enabled notifications'
                ], 404);
            }

            // save connection request data
            $status = AppData::$connectionStatusLabels['pending'];
            $existingRequest = ConnectionRequest::where(function($query) use ($senderId, $receiverId) {
                $query->where('sender_id', $senderId)
                    ->where('receiver_id', $receiverId);
            })->orWhere(function($query) use ($senderId, $receiverId) {
                $query->where('sender_id', $receiverId)
                    ->where('receiver_id', $senderId);
            })->where('status', 'pending')
                ->first();

            if (! $existingRequest) {
                ConnectionRequest::create([
                    'sender_id' => $senderId,
                    'receiver_id' => $receiverId,
                    'status' => $status,
                    'message' => 'I want to practice english speaking with you.. please accept connection request',
                ]);
            }

            // Send push notification
            $message = "{$sender->name} wants to connect with you for speaking practice";
            $result = $this->oneSignalService->sendPushNotification($playerIds, $message, [
                'sender_id' => $senderId,
                'type' => 'speaking_connection_request'
            ]);

            // Log the attempt
            SpeakingNotificationLog::create([
                'sender_id' => $senderId,
                'receiver_id' => $receiverId,
                'player_ids_sent' => $playerIds,
                'status' => $result['success'] ? 'success' : 'failed',
                'error_message' => $result['error']
            ]);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Notification sent successfully',
                    'sent_to_devices' => count($playerIds)
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send notification',
                    'error' => $result['error']
                ], 500);
            }

        } catch (\Exception $e) {
            // Log exception
            SpeakingNotificationLog::create([
                'sender_id' => $senderId,
                'receiver_id' => $receiverId,
                'player_ids_sent' => $playerIds ?? [],
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
