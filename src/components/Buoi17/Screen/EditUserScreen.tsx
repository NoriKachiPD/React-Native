import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import UserDatabase, { User } from '../UserDatabase';
import { RootStackParamList } from '../AppNavigatorProduct';

type EditUserScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditUserScreen'>;
type EditUserScreenRouteProp = RouteProp<RootStackParamList, 'EditUserScreen'>;

const EditUserScreen = () => {
  const navigation = useNavigation<EditUserScreenNavigationProp>();
  const route = useRoute<EditUserScreenRouteProp>();
  const { user } = route.params;

  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState(user.password);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [image, setImage] = useState<string | null>(user.image);
  const [level, setLevel] = useState(user.level.toString());

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Lỗi', `Không thể chọn ảnh: ${response.errorMessage}`);
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri || null);
      }
    });
  };

  const onSaveUser = async () => {
    if (!username || !password || !email || !phone || !image || !level) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin và chọn ảnh');
      return;
    }

    const userToSave: User = {
      id: user.id,
      username,
      password,
      email,
      phone,
      image,
      level: Number(level),
    };

    const success = await UserDatabase.updateUser(userToSave);
    Alert.alert('Thông báo', success ? 'Cập nhật user thành công' : 'Cập nhật user thất bại');
    if (success) {
      navigation.goBack();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Sửa User</Text>
      {image ? (
        <Image source={{ uri: image }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholderAvatar]}>
          <Text style={styles.placeholderText}>Chưa chọn ảnh</Text>
        </View>
      )}
      <TouchableOpacity style={styles.imageButton} onPress={pickImage} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Chọn Ảnh</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={level}
          onValueChange={(itemValue) => setLevel(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="User" value="3" />
          <Picker.Item label="Admin" value="1" />
        </Picker>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={onSaveUser}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Quay Lại</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    // Đổi justifyContent thành 'flex-start' để không căn giữa dọc
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 12,
  },
  placeholderAvatar: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  imageButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 5,
    shadowColor: '#FF9800',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: '#4DB6AC',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    elevation: 5,
    shadowColor: '#4DB6AC',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
    elevation: 5,
    shadowColor: '#2196F3',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default EditUserScreen;