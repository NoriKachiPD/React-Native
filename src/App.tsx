import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigatorProduct from './components/Buoi17/AppNavigatorProduct';
import UserDatabase from './components/Buoi17/UserDatabase';
import PushNotification from 'react-native-push-notification';

export default function App() {
  useEffect(() => {
    // async function initialize() {
    //   await UserDatabase.init();
    //   console.log('UserDatabase initialized with default admin.');
    // }
    // initialize();

    // Tạo kênh thông báo
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id',
        channelName: 'Default Channel',
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );

    // Gửi thông báo khi app mở
    PushNotification.localNotification({
      channelId: 'default-channel-id',
      title: 'Welcome',
      message: 'Ứng dụng khởi động thành công. Chúc bạn một ngày tuyệt vời!',
    });
  }, []);

  return (
    <NavigationContainer>
      <AppNavigatorProduct />
    </NavigationContainer>
  );
}