import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, KeyboardAvoidingView, Platform, } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import ProductDatabase, { Product, Category } from '../ProductDatabase';
import { RootStackParamList } from '../AppNavigatorProduct';

type EditProductScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditProductScreen'>;
type EditProductScreenRouteProp = RouteProp<RootStackParamList, 'EditProductScreen'>;

const formatPrice = (price: string | number): string => {
  const numPrice = Number(price);
  if (isNaN(numPrice)) return '0 ₫';
  return numPrice.toLocaleString('vi-VN') + ' ₫';
};

const EditProductScreen = () => {
  const navigation = useNavigation<EditProductScreenNavigationProp>();
  const route = useRoute<EditProductScreenRouteProp>();
  const { product } = route.params;

  const [name, setName] = useState(product.name);
  const [priceText, setPriceText] = useState(product.price);
  const [image, setImage] = useState<string | null>(product.image);
  const [categoryId, setCategoryId] = useState(product.categoryId.toString());
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const catList = await ProductDatabase.getCategories();
      setCategories(catList);
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
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin và chọn ảnh');
      return;
    }

    const numericPrice = Number(priceText);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert('Lỗi', 'Giá sản phẩm phải là số hợp lệ và lớn hơn 0');
      return;
    }

    const productToSave: Product = {
      id: product.id,
      name: name.trim(),
      price: numericPrice.toString(),
      image,
      categoryId: Number(categoryId),
    };

    try {
      await ProductDatabase.updateProduct(productToSave);
      Alert.alert('Thành công', 'Cập nhật sản phẩm thành công');
      navigation.goBack();
    } catch (e) {
      console.error('Error updating product:', e);
      Alert.alert('Lỗi', 'Cập nhật sản phẩm thất bại');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Sửa Sản Phẩm</Text>
        <Image
          source={image ? { uri: image } : { uri: 'https://via.placeholder.com/100' }}
          style={styles.image}
          onError={() => console.log('Failed to load image')}
        />
        <TouchableOpacity style={styles.imageButton} onPress={pickImage} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Chọn Ảnh</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Tên sản phẩm"
          value={name}
          onChangeText={setName}
          style={styles.input}
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 12,
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
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
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

export default EditProductScreen;