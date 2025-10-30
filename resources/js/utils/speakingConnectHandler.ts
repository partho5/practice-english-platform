// resources/js/utils/speakingConnectHandler.ts

import axios from 'axios';
import {usePage} from "@inertiajs/react";
import {statusLabels} from "@/Pages/Speaking/SpeakingData";

interface ConnectResponse {
    success: boolean;
    message: string;
    sent_to_devices?: number;
    error?: string;
}

export const handleConnectRequest = async (targetUserId: number, userMyself: any): Promise<void> => {
    console.log('handleConnectRequest() user', userMyself);
    if (!userMyself) {
        window.location.href = '/login';
        return;
    }

    // Check if already sent
    const storageKey = `connection_request_${targetUserId}`;
    const alreadySent = localStorage.getItem(storageKey);

    if (alreadySent) {
        alert('Connection request already sent to this user.');
        return;
    }

    try {
        const response = await axios.post<ConnectResponse>('/speaking/notification', {
            target_user_id: targetUserId
        });

        if (response.data.success) {
            // Save to localStorage
            localStorage.setItem(storageKey, 'true');
            // console.log(`Connection request Notified ${response.data.sent_to_devices || 1} device(s).`)
            alert(`Connection request sent successfully!`);
        } else {
            alert(response.data.message || 'Failed to send connection request.');
        }
    } catch (error: any) {
        if (error.response?.status === 404) {
            alert('This user has not enabled notifications yet.');
        } else if (error.response?.status === 400) {
            alert(error.response.data.message || 'Cannot send request to yourself.');
        } else {
            console.error('Connect request error:', error);
            alert('Failed to send connection request. Please try again.');
        }
    }
};

// Helper to check if request already sent
export const isRequestSent = (targetUserId: number): boolean => {
    const storageKey = `connection_request_${targetUserId}`;
    return localStorage.getItem(storageKey) === 'true';
};

/*
* Remove 'connected' from dropdown, because user sending connection request is not supposed to mark themselves as 'connected'.
* But once connection accepted, they may choose any status they wish.
* */
export const getAvailableStatusLabels = (activeTab: string, connectionStatus: string|null) => {
    if (connectionStatus === 'connected') {
        return statusLabels;
    }
    if (activeTab === 'sent') {
        const { connected, ...rest } = statusLabels;
        return rest;
    }
    return statusLabels;
};
