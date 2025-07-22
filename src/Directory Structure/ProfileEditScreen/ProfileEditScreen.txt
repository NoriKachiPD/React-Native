import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import UserDatabase, { User } from '../UserDatabase';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../AppNavigatorProduct';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileEditScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ProfileEditScreenRouteProp = RouteProp<RootStackParamList, 'ProfileEditScreen'>;

const DEFAULT_IMAGE = 'https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg';

const ProfileEditScreen = () => {
  const navigation = useNavigation<ProfileEditScreenNavigationProp>();
  const route = useRoute<ProfileEditScreenRouteProp>();
  const { user } = route.params;

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [image, setImage] = useState(user.image || 'https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg');
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
    // Xóa khoảng trống ở cuối các trường nhập liệu
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedOldPassword = oldPassword.trim();
    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // Validate inputs
    if (!validateUsername(trimmedUsername)) {
      Alert.alert('Lỗi', 'Tên đăng nhập phải từ 3-20 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới.');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }

    if (!validatePhone(trimmedPhone)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ (10-11 số)');
      return;
    }

    // Check for duplicate username, email, or phone
    const users = await UserDatabase.getUsers();
    const existingUser = users.find(
      (u) =>
        u.username !== user.username &&
        (u.username === trimmedUsername || u.email === trimmedEmail || u.phone === trimmedPhone)
    );
    if (existingUser) {
      Alert.alert('Lỗi', 'Tên đăng nhập, email hoặc số điện thoại đã được sử dụng');
      return;
    }

    // Validate password if provided
    if (trimmedOldPassword || trimmedNewPassword || trimmedConfirmPassword) {
      if (!trimmedOldPassword) {
        Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu cũ');
        return;
      }

      const authResult = await UserDatabase.authenticate(user.username, trimmedOldPassword);
      if (!authResult.success) {
        Alert.alert('Lỗi', 'Mật khẩu cũ không đúng');
        return;
      }

      if (!trimmedNewPassword) {
        Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu mới');
        return;
      }

      if (!validatePassword(trimmedNewPassword)) {
        Alert.alert('Lỗi', 'Mật khẩu mới phải từ 6 ký tự, chứa ít nhất một chữ hoa và một ký tự đặc biệt (!@#$%^&*)');
        return;
      }

      if (trimmedNewPassword !== trimmedConfirmPassword) {
        Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận không khớp');
        return;
      }
    }

    // Prepare updated user
    const updatedUser: User = {
      ...user,
      username: trimmedUsername,
      email: trimmedEmail,
      phone: trimmedPhone,
      image,
      password: trimmedNewPassword || user.password, // Use new password if provided
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Chỉnh Sửa Hồ Sơ</Text>

        <View style={styles.profileCard}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          <Image
              source={{ uri: image }}
              style={styles.profileImage}
              onError={() => setImage(DEFAULT_IMAGE)} // Fallback to default if image fails
            />
            <Text style={styles.imageText}>Thay đổi ảnh đại diện</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Cấp độ: {user.level === 1 ? 'Admin' : 'Người dùng'}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tên đăng nhập</Text>
          <TextInput
            placeholder="Tên đăng nhập"
            style={styles.input}
            onChangeText={(text) => setUsername(text.trim())} // Xóa khoảng trống ngay khi nhập
            value={username}
            placeholderTextColor="#999"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={(text) => setEmail(text.trim())} // Xóa khoảng trống ngay khi nhập
            value={email}
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Số điện thoại</Text>
          <TextInput
            placeholder="Số điện thoại"
            style={styles.input}
            onChangeText={(text) => setPhone(text.trim())} // Xóa khoảng trống ngay khi nhập
            value={phone}
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Mật khẩu cũ</Text>
          <TextInput
            placeholder="Mật khẩu cũ"
            style={styles.input}
            onChangeText={(text) => setOldPassword(text.trim())} // Xóa khoảng trống ngay khi nhập
            value={oldPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Mật khẩu mới</Text>
          <TextInput
            placeholder="Mật khẩu mới"
            style={styles.input}
            onChangeText={(text) => setNewPassword(text.trim())} // Xóa khoảng trống ngay khi nhập
            value={newPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Xác nhận mật khẩu mới</Text>
          <TextInput
            placeholder="Xác nhận mật khẩu mới"
            style={styles.input}
            onChangeText={(text) => setConfirmPassword(text.trim())} // Xóa khoảng trống ngay khi nhập
            value={confirmPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
        </View>

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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#E8F5E9', // Xanh pastel nhẹ
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#E91806', // Đỏ chủ đạo
    marginVertical: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#4DB6AC', // Viền xanh ngọc
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#4DB6AC', // Viền xanh ngọc
    marginBottom: 12,
  },
  imageText: {
    color: '#E91806', // Đỏ chủ đạo
    fontSize: 18,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4DB6AC', // Xanh ngọc
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#4DB6AC', // Viền xanh ngọc
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  saveButton: {
    backgroundColor: '#4DB6AC', // Xanh ngọc
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#4DB6AC',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  backButton: {
    backgroundColor: '#E91806', // Đỏ chủ đạo
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#E91806',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default ProfileEditScreen;