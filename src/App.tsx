import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigatorProduct from './components/Buoi17/AppNavigatorProduct';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PushNotification from 'react-native-push-notification';

export default function App() {
  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: 'custom-sound-channel-v1',
        channelName: 'Custom Sound Channel V1',
        soundName: 'sound',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );

    PushNotification.localNotification({
      channelId: 'custom-sound-channel-v1',
      title: 'WELCOME',
      message: 'App khởi động thành công. Chúc bạn một ngày tốt lành!',
      playSound: true,
      soundName: 'sound',
    });    
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigatorProduct />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}