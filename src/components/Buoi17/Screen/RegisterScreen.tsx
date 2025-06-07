import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, } from 'react-native';
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^[0-9]{10,11}$/;
    return re.test(phone);
  };

  const handleRegister = async () => {
    if (username === '' || password === '' || confirmPassword === '' || email === '' || phone === '') {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }

    if (!validatePhone(phone)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ (10-11 số)');
      return;
    }

    const success = await UserDatabase.addUser({
      username,
      password,
      level: 3,
      email,
      phone,
      image: 'src/Img/1.jpg',
    });

    if (success) {
      Alert.alert('Thành công', 'Đăng ký thành công', [
        { text: 'OK', onPress: () => navigation.replace('LoginScreen') },
      ]);
    } else {
      Alert.alert('Lỗi', 'Tài khoản, email hoặc số điện thoại đã tồn tại');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Tạo Tài Khoản Mới</Text>

      <TextInput
        placeholder="Nhập tên đăng nhập"
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholderTextColor="#888888"
        returnKeyType="next"
      />

      <TextInput
        placeholder="Nhập Email"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholderTextColor="#888888"
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
      />

      <TextInput
        placeholder="Nhập số điện thoại"
        style={styles.input}
        onChangeText={setPhone}
        value={phone}
        placeholderTextColor="#888888"
        keyboardType="phone-pad"
        returnKeyType="next"
      />

      <TextInput
        placeholder="Nhập mật khẩu"
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        placeholderTextColor="#888888"
        returnKeyType="next"
      />

      <TextInput
        placeholder="Xác nhận mật khẩu"
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry
        placeholderTextColor="#888888"
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

      <View style={styles.linkContainer}>
        <View style={styles.linkWrapper}>
          <Text style={styles.link}>Đã có tài khoản? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('LoginScreen')}
            activeOpacity={0.7}
          >
            <Text style={styles.linkHighlight}>Đăng nhập ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
    color: '#333333',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: '600',
    elevation: 2,
  },
  button: {
    backgroundColor: '#3498DB',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  linkContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  linkWrapper: {
    flexDirection: 'row', // Đặt hàng ngang
    alignItems: 'center', // Căn giữa theo chiều dọc
    flexWrap: 'nowrap', // Không xuống dòng
  },
  link: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24, // Đảm bảo căn dòng
  },
  linkHighlight: {
    color: '#3498DB',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 24, // Đồng bộ với link
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;