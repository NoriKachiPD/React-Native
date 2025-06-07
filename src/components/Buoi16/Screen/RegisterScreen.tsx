// src/components/buoi16/Screen/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UserDatabase from '../UserDatabase';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigatorProduct';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RegisterScreen'
>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (username === '' || password === '') {
      Alert.alert('Lỗi', 'Không được bỏ trống');
      return;
    }
    const success = await UserDatabase.addUser({ username, password });
    if (success) {
      Alert.alert('Thành công', 'Đăng ký thành công', [
        { text: 'OK', onPress: () => navigation.replace('LoginScreen') },
      ]);
    } else {
      Alert.alert('Lỗi', 'Tài khoản đã tồn tại');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo Tài Khoản Mới</Text>

      <TextInput
        placeholder="Nhập tên đăng nhập"
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholderTextColor="#BFD7EA"
        returnKeyType="next"
        onSubmitEditing={() => {
          // Khi nhấn Enter ở ô username, chuyển focus sang ô password nếu muốn
          // Bạn có thể dùng ref nếu muốn focus tự động
        }}
      />

      <TextInput
        placeholder="Nhập mật khẩu"
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        placeholderTextColor="#BFD7EA"
        returnKeyType="done"
        onSubmitEditing={handleRegister}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Đăng ký ngay</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('LoginScreen')}
        activeOpacity={0.7}
      >
        <Text style={styles.link}>
          Đã có tài khoản?{' '}
          <Text style={styles.linkHighlight}>Đăng nhập ngay</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E90FF',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#FFF9C4',
    textShadowColor: '#FFEB3B',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    letterSpacing: 1.5,
  },
  input: {
    borderWidth: 2,
    borderColor: '#FFE082',
    backgroundColor: '#FFFFFFCC',
    color: '#1565C0',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 14,
    fontSize: 18,
    fontWeight: '700',
    shadowColor: '#FFEB3B',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  button: {
    backgroundColor: '#FFD600',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#FBC02D',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#0D47A1',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  link: {
    color: '#BBDEFB',
    fontSize: 18,
    textAlign: 'center',
  },
  linkHighlight: {
    color: '#FFF176',
    fontWeight: 'bold',
    fontSize: 19,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;