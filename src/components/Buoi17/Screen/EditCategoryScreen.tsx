import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import ProductDatabase, { Category } from '../ProductDatabase';
import { RootStackParamList } from '../AppNavigatorProduct';

type EditCategoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditCategoryScreen'>;
type EditCategoryScreenRouteProp = RouteProp<RootStackParamList, 'EditCategoryScreen'>;

const EditCategoryScreen = () => {
  const navigation = useNavigation<EditCategoryScreenNavigationProp>();
  const route = useRoute<EditCategoryScreenRouteProp>();
  const { category } = route.params;

  const [name, setName] = useState(category.name);
  const [icon, setIcon] = useState(category.icon);
  const [color, setColor] = useState(category.color);

  const onSaveCategory = async () => {
    if (!name.trim() || !icon.trim() || !color.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      Alert.alert('Lỗi', 'Màu phải là mã hex hợp lệ (VD: #FF0000)');
      return;
    }

    const categoryToSave: Category = {
      id: category.id,
      name: name.trim(),
      icon: icon.trim(),
      color: color.trim(),
    };

    try {
      await ProductDatabase.updateCategory(categoryToSave);
      Alert.alert('Thành công', 'Cập nhật danh mục thành công');
      navigation.goBack();
    } catch (e) {
      console.error('Lỗi cập nhật danh mục:', e);
      Alert.alert('Lỗi', 'Cập nhật danh mục thất bại');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Sửa Danh Mục</Text>
        <TextInput
          placeholder="Tên danh mục (VD: Sushi)"
          value={name}
          onChangeText={setName}
          style={styles.input}
          autoCapitalize="sentences"
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="Tên icon (VD: 🍣)"
          value={icon}
          onChangeText={setIcon}
          style={styles.input}
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="Màu hex (VD: #FF0000)"
          value={color}
          onChangeText={setColor}
          style={styles.input}
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={onSaveCategory} activeOpacity={0.8}>
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#E8F5E9', // Xanh pastel
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#E91E63', // Hồng phấn
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    color: '#333', // Thêm màu chữ
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
   saveButton: {
     backgroundColor: '#26A69A', // Xanh ngọc
     paddingVertical: 16,
     borderRadius: 12,
     alignItems: 'center',
     flex: 1,
     marginRight: 8,
     elevation: 6,
     shadowColor: '#000',
     shadowOpacity: 0.3,
     shadowOffset: { width: 0, height: 3 },
     shadowRadius: 5,
     borderWidth: 1,
     borderColor: '#FFCA28', // Viền vàng
   },
   backButton: {
     backgroundColor: '#0288D1', // Xanh dương
     paddingVertical: 16,
     borderRadius: 12,
     alignItems: 'center',
     flex: 1,
     marginLeft: 8,
     elevation: 6,
     shadowColor: '#000',
     shadowOpacity: 0.3,
     shadowOffset: { width: 0, height: 3 },
     shadowRadius: 5,
     borderWidth: 1,
     borderColor: '#FFCA28', // Viền vàng
   },
   buttonText: {
     color: '#FFFFFF',
     fontSize: 16,
     fontWeight: '700',
   },
});

export default EditCategoryScreen;