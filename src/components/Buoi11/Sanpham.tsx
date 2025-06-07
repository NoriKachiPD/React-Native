//components/Buoi11/Sanpham.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { launchImageLibrary } from 'react-native-image-picker';

import {
  initDatabase,
  fetchCategories,
  fetchProductsByCategory,
  addProduct,
  updateProduct,
  deleteProduct,
  Product,
  Category
} from './database';

const Sanpham = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    initDatabase(() => {
      loadCategories();
    });
  }, []);

  const loadCategories = async () => {
    const cats = await fetchCategories();
    setCategories(cats);
    if (cats.length > 0) {
      setCategoryId(cats[0].id);
    }
  };

  useEffect(() => {
    if (categoryId !== null) {
      loadProducts(categoryId);
    }
  }, [categoryId]);

  const loadProducts = async (catId: number) => {
    const prods = await fetchProductsByCategory(catId);
    setProducts(prods);
  };

  const handlePickImage = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('Người dùng đã hủy chọn ảnh');
        } else if (response.errorCode) {
          Alert.alert('Lỗi chọn hình ảnh', response.errorMessage || 'Lỗi không xác định');
        } else if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri || null);
        }
      }
    );
  };

  const getImageSource = (img: string) => {
    if (img.startsWith('file://') || img.startsWith('content://')) {
      return { uri: img };
    }
    switch (img) {
      case '1.jpg': return require('../../Img/1.jpg');
      case '2.jpg': return require('../../Img/2.jpg');
      default: return require('../../Img/1.jpg');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <RNPickerSelect
        onValueChange={(value) => setCategoryId(value)}
        items={categories.map(c => ({ label: c.name, value: c.id }))}
        value={categoryId}
        style={{
          inputAndroid: styles.input,
          inputIOS: styles.input,
        }}
      />

      <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
        <Text style={styles.buttonText}>
          {imageUri ? 'Chọn lại hình ảnh' : 'Chọn hình ảnh'}
        </Text>
      </TouchableOpacity>

      {imageUri && <Image source={getImageSource(imageUri)} style={styles.selectedImage} />}

      {/* Hiển thị danh sách sản phẩm tùy chỉnh ở đây */}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  imagePicker: {
    backgroundColor: '#007bff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

export default Sanpham;