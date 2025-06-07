import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, ScrollView, } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import UserDatabase, { User } from '../UserDatabase';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../AppNavigatorProduct';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileEditScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ProfileEditScreenRouteProp = RouteProp<RootStackParamList, 'ProfileEditScreen'>;

const DEFAULT_IMAGE = require('../../../Img/1.jpg');

const ProfileEditScreen = () => {
  const navigation = useNavigation<ProfileEditScreenNavigationProp>();
  const route = useRoute<ProfileEditScreenRouteProp>();
  const { user } = route.params;

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [image, setImage] = useState(user.image || 'src/Img/1.jpg');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateUsername = (username: string) => {
    const re = /^[a-zA-Z0-9_]{3,20}$/;
    return re.test(username);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^[0-9]{10,11}$/;
    return re.test(phone);
  };

  const validatePassword = (password: string) => {
    const re = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9_!@#$%^&*]{6,}$/;
    return re.test(password);
  };

  const pickImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: false,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Lỗi', `Không thể chọn ảnh: ${response.errorMessage}`);
      } else if (response.assets && response.assets[0].uri) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleSave = async () => {
    // Validate inputs
    if (!validateUsername(username)) {
      Alert.alert('Lỗi', 'Tên đăng nhập phải từ 3-20 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới.');
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

    // Check for duplicate username, email, or phone
    const users = await UserDatabase.getUsers();
    const existingUser = users.find(
      (u) =>
        u.username !== user.username &&
        (u.username === username || u.email === email || u.phone === phone)
    );
    if (existingUser) {
      Alert.alert('Lỗi', 'Tên đăng nhập, email hoặc số điện thoại đã được sử dụng');
      return;
    }

    // Validate password if provided
    if (oldPassword || newPassword || confirmPassword) {
      if (!oldPassword) {
        Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu cũ');
        return;
      }

      const authResult = await UserDatabase.authenticate(user.username, oldPassword);
      if (!authResult.success) {
        Alert.alert('Lỗi', 'Mật khẩu cũ không đúng');
        return;
      }

      if (!newPassword) {
        Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu mới');
        return;
      }

      if (!validatePassword(newPassword)) {
        Alert.alert('Lỗi', 'Mật khẩu mới phải từ 6 ký tự, chứa ít nhất một chữ hoa và một ký tự đặc biệt (!@#$%^&*)');
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận không khớp');
        return;
      }
    }

    // Prepare updated user
    const updatedUser: User = {
      ...user,
      username,
      email,
      phone,
      image,
      password: newPassword || user.password, // Use new password if provided
    };

    // Confirm before saving
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn lưu các thay đổi này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Lưu',
          onPress: async () => {
            const success = await UserDatabase.updateUser(updatedUser);
            if (success) {
              // Update AsyncStorage to reflect changes
              try {
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
              } catch (error) {
                console.error('Error saving user to AsyncStorage:', error);
              }
              Alert.alert('Thành công', 'Cập nhật thông tin thành công', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } else {
              Alert.alert('Lỗi', 'Cập nhật thất bại, vui lòng thử lại');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chỉnh Sửa Hồ Sơ</Text>

      <View style={styles.profileCard}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          <Image
            source={image === 'src/Img/1.jpg' || !image ? DEFAULT_IMAGE : { uri: image }}
            style={styles.profileImage}
          />
          <Text style={styles.imageText}>Thay đổi ảnh đại diện</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Cấp độ: {user.level === 1 ? 'Admin' : 'Người dùng'}</Text>
      </View>

      <TextInput
        placeholder="Tên đăng nhập"
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholderTextColor="#999"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Số điện thoại"
        style={styles.input}
        onChangeText={setPhone}
        value={phone}
        placeholderTextColor="#999"
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="Mật khẩu cũ"
        style={styles.input}
        onChangeText={setOldPassword}
        value={oldPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Mật khẩu mới"
        style={styles.input}
        onChangeText={setNewPassword}
        value={newPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Xác nhận mật khẩu mới"
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Lưu Thay Đổi</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Quay Lại</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginVertical: 20,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#4DB6AC',
    marginBottom: 10,
  },
  imageText: {
    color: '#4DB6AC',
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#4DB6AC',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#4DB6AC',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  backButton: {
    backgroundColor: '#888',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#888',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ProfileEditScreen;