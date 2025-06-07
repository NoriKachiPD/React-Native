import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../AppNavigatorProduct';
import { User } from '../UserDatabase';
import BottomNavBar from '../BottomNavBar';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DEFAULT_IMAGE = require('../../../Img/1.jpg');

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const isFocused = useIsFocused();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user from AsyncStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUser();
    }
  }, [isFocused]);

  const handleAdminScreen = () => {
    navigation.navigate('AdminScreen');
  };

  const handleEditProfile = () => {
    if (user) {
      navigation.navigate('ProfileEditScreen', { user });
    }
  };

  const handleLogout = async () => {
    Alert.alert('Đăng Xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng Xuất',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('user');
            setUser(null);
            navigation.replace('HomeScreen');
          } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
          }
        },
      },
    ]);
  };

  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const handleRegister = () => {
    navigation.navigate('RegisterScreen');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Hồ Sơ Người Dùng</Text>

        {!user ? (
          <View style={styles.notLoggedInContainer}>
            <Text style={styles.notLoggedInText}>Bạn chưa đăng nhập, hãy đăng nhập</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Đăng Nhập</Text>
            </TouchableOpacity>
            <View style={styles.registerLinkContainer}>
              <View style={styles.registerLinkWrapper}>
                <Text style={styles.registerLink}>Bạn chưa có tài khoản? </Text>
                <TouchableOpacity
                  onPress={handleRegister}
                  activeOpacity={0.7}
                >
                  <Text style={styles.registerLinkHighlight}>Đăng ký ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.profileCard}>
              <Image
                source={user.image === '1.jpg' ? DEFAULT_IMAGE : { uri: user.image }}
                style={styles.profileImage}
              />
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.level}>Cấp độ người dùng: {user.level === 1 ? 'Admin' : 'Người dùng'}</Text>
              <Text style={styles.info}>Email: {user.email}</Text>
              <Text style={styles.info}>Số điện thoại: {user.phone}</Text>
            </View>

            {user.level === 1 && (
              <TouchableOpacity
                style={styles.adminButton}
                onPress={handleAdminScreen}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Quản Lý Admin</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Chỉnh Sửa Hồ Sơ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Đăng Xuất</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 60, // Space for BottomNavBar
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginVertical: 20,
    textAlign: 'center',
  },
  notLoggedInContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    marginBottom: 24,
  },
  notLoggedInText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#4DB6AC',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#4DB6AC',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    marginBottom: 20,
    width: '80%',
  },
  registerLinkContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  registerLinkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  registerLink: {
    color: '#666',
    fontSize: 16,
    lineHeight: 24,
  },
  registerLinkHighlight: {
    color: '#FF5722',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    textDecorationLine: 'underline',
  },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#4DB6AC',
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  level: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  adminButton: {
    backgroundColor: '#4DB6AC',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#4DB6AC',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  editButton: {
    backgroundColor: '#4DB6AC',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#4DB6AC',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  logoutButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#FF5722',
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

export default ProfileScreen;