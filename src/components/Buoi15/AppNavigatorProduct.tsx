import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoryScreen from './Screen/CategoryScreen';
import ProductListScreen from './Screen/ProductListScreen';

export type RootStackParamList = {
  CategoryScreen: undefined;
  ProductListScreen: { category: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigatorProduct = () => {
  return (
    <Stack.Navigator initialRouteName="CategoryScreen">
      <Stack.Screen name="CategoryScreen" component={CategoryScreen} options={{ title: 'Danh Mục Sản Phẩm' }} />
      <Stack.Screen name="ProductListScreen" component={ProductListScreen} options={{ title: 'Danh Sách Sản Phẩm' }} />
    </Stack.Navigator>
  );
};

export default AppNavigatorProduct;