// resources/js/utils/speakingConnectHandler.ts

import axios from 'axios';

interface ConnectResponse {
    success: boolean;
    message: string;
    sent_to_devices?: number;
    error?: string;
}

export const handleConnectRequest = async (targetUserId: number): Promise<void> => {
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

            alert(`Connection request sent successfully! Notified ${response.data.sent_to_devices || 1} device(s).`);
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
