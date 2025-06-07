import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, } from 'react-native';
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
      console.error('Error updating category:', e);
      Alert.alert('Lỗi', 'Cập nhật danh mục thất bại');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Sửa Danh Mục</Text>
      <TextInput
        placeholder="Tên danh mục (VD: Sushi)"
        value={name}
        onChangeText={setName}
        style={styles.input}
        autoCapitalize="sentences"
      />
      <TextInput
        placeholder="Tên icon (VD: food, MaterialCommunityIcons)"
        value={icon}
        onChangeText={setIcon}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Màu hex (VD: #FF0000)"
        value={color}
        onChangeText={setColor}
        style={styles.input}
        autoCapitalize="none"
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
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
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

export default EditCategoryScreen;