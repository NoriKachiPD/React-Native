// src/components/buoi16/Screen/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import UserDatabase from '../UserDatabase';
import { RootStackParamList } from '../AppNavigatorProduct';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LoginScreen'
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const isAuthenticated = await UserDatabase.authenticate(username, password);
    if (isAuthenticated) {
      navigation.replace('CategoryScreen');
    } else {
      Alert.alert('Lỗi', 'Sai tài khoản hoặc mật khẩu');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>

        <TextInput
            placeholder="Tên đăng nhập"
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            placeholderTextColor="#999"
        />

        <TextInput
        placeholder="Mật khẩu"
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

      <TouchableOpacity
        onPress={() => navigation.navigate('RegisterScreen')}
        activeOpacity={0.7}
      >
        <Text style={styles.link}>
          Chưa có tài khoản?{' '}
          <Text style={styles.linkHighlight}>Đăng ký ngay</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 30,
    textAlign: 'center',
    color: '#E64A19',
  },
  input: {
    borderWidth: 2,
    borderColor: '#FF8A50',
    backgroundColor: '#fff',
    marginBottom: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 18,
    color: '#333',
    shadowColor: '#FF5722',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    backgroundColor: '#FF5722',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FF5722',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  link: {
    marginTop: 24,
    color: '#222',
    textAlign: 'center',
    fontSize: 18,
  },
  linkHighlight: {
    color: '#4CAF50',
    fontWeight: '900',
    fontSize: 20,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;