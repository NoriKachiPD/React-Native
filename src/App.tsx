import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigatorProduct from './components/Buoi17/AppNavigatorProduct';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PushNotification from 'react-native-push-notification';

export default function App() {
  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: 'custom-sound-channel-v4',
        channelName: 'Custom Sound Channel V4',
        soundName: 'f1',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );

    PushNotification.localNotification({
      channelId: 'custom-sound-channel-v4',
      title: 'Have a nice day',
      message: 'App khởi động thành công. Chúc bạn một ngày tốt lành!',
      playSound: true,
      soundName: 'f1',
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