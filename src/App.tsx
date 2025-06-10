import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigatorProduct from './components/Buoi17/AppNavigatorProduct';
import UserDatabase from './components/Buoi17/UserDatabase';  // nhớ import đúng đường dẫn

export default function App() {
  useEffect(() => {
    async function initialize() {
      await UserDatabase.init();
      console.log('UserDatabase initialized with default admin.');
    }
    initialize();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigatorProduct />
    </NavigationContainer>
  );
}