import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, KeyboardAvoidingView, Platform, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import ProductDatabase, { Product, Category } from '../ProductDatabase';
import { RootStackParamList } from '../AppNavigatorProduct';

type AddProductScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddProductScreen'>;

const formatPrice = (price: string | number): string => {
  const numPrice = Number(price);
  if (isNaN(numPrice)) return '0 ₫';
  return numPrice.toLocaleString('vi-VN') + ' ₫';
};

const AddProductScreen = () => {
  const navigation = useNavigation<AddProductScreenNavigationProp>();
  const [name, setName] = useState('');
  const [priceText, setPriceText] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const catList = await ProductDatabase.getCategories();
      setCategories(catList);
      if (catList.length > 0) {
        setCategoryId(catList[0].id.toString());
      }
    } catch (e) {
      console.error('Error loading categories:', e);
      Alert.alert('Lỗi', 'Không thể tải danh sách danh mục');
    }
  };

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

  const onSaveProduct = async () => {
    if (!name.trim() || !priceText.trim() || !image || !categoryId) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên, giá, chọn ảnh và danh mục');
      return;
    }

    const numericPrice = Number(priceText);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert('Lỗi', 'Giá sản phẩm phải là số hợp lệ và lớn hơn 0');
      return;
    }

    const productToSave: Product = {
      id: Date.now().toString(),
      name: name.trim(),
      price: numericPrice.toString(),
      image,
      categoryId: Number(categoryId),
      description: description.trim() || undefined, // Sửa null thành undefined
    };

    try {
      await ProductDatabase.addProduct(productToSave);
      Alert.alert('Thành công', 'Thêm sản phẩm thành công');
      navigation.goBack();
    } catch (e) {
      console.error('Error adding product:', e);
      Alert.alert('Lỗi', 'Thêm sản phẩm thất bại');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Thêm Sản Phẩm</Text>
        <Image
          source={image ? { uri: image } : { uri: 'https://via.placeholder.com/100' }}
          style={styles.image}
          onError={() => console.log('Failed to load image')}
        />
        <TouchableOpacity style={styles.imageButton} onPress={pickImage} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Chọn Ảnh</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Tên sản phẩm (VD: Sushi Roll)"
          value={name}
          onChangeText={setName}
          style={styles.input}
          autoCapitalize="sentences"
        />
        <TextInput
          placeholder="Mô tả sản phẩm (VD: Sushi cuộn cá hồi tươi ngon)"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.descriptionInput]}
          multiline
          numberOfLines={4}
          autoCapitalize="sentences"
        />
        <View style={styles.priceInputContainer}>
          <TextInput
            placeholder="Giá (VD: 15000)"
            value={priceText}
            onChangeText={setPriceText}
            keyboardType="numeric"
            style={[styles.input, styles.priceInput]}
          />
          <Text style={styles.currencyText}>₫</Text>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoryId}
            onValueChange={(itemValue) => setCategoryId(itemValue)}
            style={styles.picker}
          >
            {categories.map(category => (
              <Picker.Item key={category.id} label={category.name} value={category.id.toString()} />
            ))}
          </Picker>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={onSaveProduct} activeOpacity={0.8}>
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
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FFCA28', // Viền vàng
  },
  imageButton: {
    backgroundColor: '#FF5722', // Cam
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#FFCA28', // Viền vàng
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
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceInput: {
    flex: 1,
    marginRight: 8,
  },
  currencyText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
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

export default AddProductScreen;