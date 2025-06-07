import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screen/HomeScreen';
import AdminScreen from './Screen/AdminScreen';
import UserManagementScreen from './Screen/UserManagementScreen';
import AddUserScreen from './Screen/AddUserScreen';
import EditUserScreen from './Screen/EditUserScreen';
import CategoryManagementScreen from './Screen/CategoryManagementScreen';
import AddCategoryScreen from './Screen/AddCategoryScreen';
import EditCategoryScreen from './Screen/EditCategoryScreen';
import ProductManagementScreen from './Screen/ProductManagementScreen';
import AddProductScreen from './Screen/AddProductScreen';
import EditProductScreen from './Screen/EditProductScreen';
import ProductListScreen from './Screen/ProductListScreen';
import ProfileScreen from './Screen/ProfileScreen';
import RegisterScreen from './Screen/RegisterScreen';
import LoginScreen from './Screen/LoginScreen';
import CategoryScreen from './Screen/CategoryScreen';
import ProfileEditScreen from './Screen/ProfileEditScreen';
import { User } from './UserDatabase';
import { Product, Category } from './ProductDatabase';

export type RootStackParamList = {
  HomeScreen: undefined;
  AdminScreen: undefined;
  UserManagementScreen: undefined;
  AddUserScreen: undefined;
  EditUserScreen: { user: User };
  CategoryManagementScreen: undefined;
  AddCategoryScreen: undefined;
  EditCategoryScreen: { category: Category };
  ProductManagementScreen: undefined;
  AddProductScreen: undefined;
  EditProductScreen: { product: Product };
  ProductListScreen: { categoryId: number; categoryName: string };
  ProfileScreen: { user?: User };
  RegisterScreen: undefined;
  LoginScreen: undefined;
  CategoryScreen: undefined;
  ProfileEditScreen: { user: User };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Trang Chủ', headerShown: false }} />
      <Stack.Screen name="AdminScreen" component={AdminScreen} options={{ title: 'Quản Lý Admin' }} />
      <Stack.Screen name="UserManagementScreen" component={UserManagementScreen} options={{ title: 'Quản Lý User' }} />
      <Stack.Screen name="AddUserScreen" component={AddUserScreen} options={{ title: 'Thêm User' }} />
      <Stack.Screen name="EditUserScreen" component={EditUserScreen} options={{ title: 'Sửa User' }} />
      <Stack.Screen name="CategoryManagementScreen" component={CategoryManagementScreen} options={{ title: 'Quản Lý Danh Mục' }} />
      <Stack.Screen name="AddCategoryScreen" component={AddCategoryScreen} options={{ title: 'Thêm Danh Mục' }} />
      <Stack.Screen name="EditCategoryScreen" component={EditCategoryScreen} options={{ title: 'Sửa Danh Mục' }} />
      <Stack.Screen name="ProductManagementScreen" component={ProductManagementScreen} options={{ title: 'Quản Lý Sản Phẩm' }} />
      <Stack.Screen name="AddProductScreen" component={AddProductScreen} options={{ title: 'Thêm Sản Phẩm' }} />
      <Stack.Screen name="EditProductScreen" component={EditProductScreen} options={{ title: 'Sửa Sản Phẩm' }} />
      <Stack.Screen name="ProductListScreen" component={ProductListScreen} options={{ title: 'Danh Sách Sản Phẩm' }} />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'Hồ Sơ',
          headerLeft: () => null,
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          title: 'Đăng Ký',
          headerLeft: () => null,
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          title: 'Đăng Nhập',
          headerLeft: () => null,
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{
          title: 'Danh sách loại sản phẩm',
          headerLeft: () => null,
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen name="ProfileEditScreen" component={ProfileEditScreen} options={{ title: 'Chỉnh Sửa Hồ Sơ' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;