import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoryScreen from './Screen/CategoryScreen';
import ProductListScreen from './Screen/ProductListScreen';
import LoginScreen from './Screen/LoginScreen';
import RegisterScreen from './Screen/RegisterScreen';

export type RootStackParamList = {
  CategoryScreen: undefined;
  ProductListScreen: { category: string };
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigatorProduct = () => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ 
            title: 'Đăng Nhập' ,
            headerBackVisible: false, // ẩn nút back
            }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
            title: 'Đăng Ký',
            headerBackVisible: false, // ẩn nút back
            }}
      />
      <Stack.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{ 
            title: 'Danh Mục Sản Phẩm' ,
            headerBackVisible: false, // ẩn nút back
            }}
      />
      <Stack.Screen
        name="ProductListScreen"
        component={ProductListScreen}
        options={{ title: 'Danh Sách Sản Phẩm' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigatorProduct;