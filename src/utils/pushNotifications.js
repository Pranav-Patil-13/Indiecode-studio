import { PushNotifications } from '@capacitor/push-notifications';
import { supabase } from '../lib/supabase';
import { Capacitor } from '@capacitor/core';

export const initializePushNotifications = async (user) => {
  if (!user || !Capacitor.isNativePlatform()) {
    console.log('Push notifications not supported on web or no user.');
    return;
  }

  // Request permission to use push notifications
  // IOS will prompt user and return if they granted permission or not
  // Android will prompt user and return if they granted permission or not
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    console.warn('User denied permissions for push notifications.');
    return;
  }

  // Register with Apple / Google to receive push via APNS/FCM
  await PushNotifications.register();

  // On success, we should be able to receive notifications
  PushNotifications.addListener('registration', async (token) => {
    console.log('Push registration success, token: ' + token.value);
    await saveTokenToDatabase(user.id, user.email, token.value);
  });

  // Some error occurred
  PushNotifications.addListener('registrationError', (error) => {
    console.error('Error on registration: ' + JSON.stringify(error));
  });

  // Show us the notification payload if the app is open on our device
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push received: ' + JSON.stringify(notification));
  });

  // Method called when tapping on a notification
  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('Push action performed: ' + JSON.stringify(notification));
  });
};

const saveTokenToDatabase = async (userId, email, token) => {
  try {
    const { error } = await supabase
      .from('user_push_tokens')
      .upsert(
        { 
          user_id: userId,
          email: email,
          token: token,
          device_info: {
            platform: Capacitor.getPlatform(),
            last_updated: new Date().toISOString()
          }
        },
        { onConflict: 'user_id, token' }
      );

    if (error) {
      console.error('Error saving push token:', error);
    } else {
      console.log('Push token saved successfully.');
    }
  } catch (err) {
    console.error('Unexpected error saving push token:', err);
  }
};

export const sendPushNotification = async (targetUserId, title, body, data = {}) => {
  try {
    // This calls a Supabase Edge Function that you'll need to deploy
    // The Edge Function will use the Firebase Admin SDK to send the actual push
    const { data: response, error } = await supabase.functions.invoke('send-push-notification', {
      body: { targetUserId, title, body, data }
    });
    
    if (error) {
      console.warn('Push notification trigger failed (Function might not be deployed yet):', error);
      return null;
    }
    
    return response;
  } catch (err) {
    console.error('Error triggering push notification:', err);
    return null;
  }
};
