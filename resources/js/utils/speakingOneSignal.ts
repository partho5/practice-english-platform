// resources/js/utils/oneSignal.ts

import axios from 'axios';

declare global {
    interface Window {
        OneSignalDeferred: any;
    }
}

export const initOneSignal = (ONESIGNAL_APP_ID: string) => {
    if (typeof window === 'undefined') return;
    window.OneSignalDeferred = window.OneSignalDeferred || [];

    window.OneSignalDeferred.push(async function (OneSignal: any) {
        await OneSignal.init({
            appId: ONESIGNAL_APP_ID,
            safari_web_id: "web.onesignal.auto.2510e921-2066-4b3b-be25-8e0e09bd836c",
            notifyButton: { enable: true },
            allowLocalhostAsSecureOrigin: true,
        });
    });
};

export const subscribeToOneSignal = async (): Promise<boolean> => {
    return new Promise((resolve) => {
        window.OneSignalDeferred.push(async function(OneSignal: any) {
            await OneSignal.Slidedown.promptPush();

            OneSignal.User.PushSubscription.addEventListener('change', async function(event: any) {
                if (event.current.id) {
                    try {
                        await axios.post('/speaking/subscribe', {
                            player_id: event.current.id
                        });
                        console.log('Subscription saved, player_id:', event.current.id);
                        localStorage.setItem('hasSubscribedOnesignal', "true");
                        resolve(true);
                    } catch (error) {
                        console.error('Failed to save subscription:', error);
                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
            });
        });
    });
};

export const checkIfSubscribed = (): Promise<boolean> => {
    return new Promise((resolve) => {
        window.OneSignalDeferred.push(function(OneSignal: any) {
            resolve(OneSignal.User.PushSubscription.optedIn);
        });
    });
};
