import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserDatabase from '../UserDatabase';
import { RootStackParamList } from '../AppNavigatorProduct';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const result = await UserDatabase.authenticate(identifier, password);
    if (result.success && result.user) {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(result.user));
      } catch (err) {
        console.error('Error saving user to AsyncStorage:', err);
      }
      navigation.replace('HomeScreen');
    } else {
      Alert.alert('Lỗi', 'Sai thông tin đăng nhập hoặc mật khẩu sai');
    }
  };

  const handleUseWithoutLogin = () => {
    navigation.navigate('HomeScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>

      <TextInput
        placeholder="Nhập Tên đăng nhập, Email hoặc Số điện thoại"
        style={styles.input}
        onChangeText={setIdentifier}
        value={identifier}
        placeholderTextColor="#999"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Nhập mật khẩu"
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        placeholderTextColor="#999"
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <View style={styles.linkWrapper}>
          <Text style={styles.link}>Chưa có tài khoản? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('RegisterScreen')}
            activeOpacity={0.7}
          >
            <Text style={styles.linkHighlight}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.useWithoutLoginButton}
        onPress={handleUseWithoutLogin}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Sử dụng với trạng thái không đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginBottom: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  button: {
    backgroundColor: '#4DB6AC',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
    shadowColor: '#4DB6AC',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  useWithoutLoginButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
    shadowColor: '#2196F3',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  linkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  link: {
    color: '#666',
    fontSize: 16,
    lineHeight: 24,
  },
  linkHighlight: {
    color: '#FF5722',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;