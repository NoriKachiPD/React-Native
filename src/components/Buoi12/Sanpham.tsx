//components/Buoi12/Sanpham.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, StyleSheet,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  Product, Category, fetchCategories, fetchProducts, addProduct, deleteProduct,
  updateProduct, searchProducts
} from './database';

const Sanpham = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);
    setCategories(cats);
    setProducts(prods);
  };

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets[0]?.uri) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const getImageSource = (img: string) => {
    return img.startsWith('file://') ? { uri: img } : require('../../Img/1.jpg');
  };

  const handleAddOrUpdate = async () => {
    const prod = { name, price: parseFloat(price), img: imageUri || '1.jpg', categoryId };
    if (editingId) {
      await updateProduct({ ...prod, id: editingId });
      setEditingId(null);
    } else {
      await addProduct(prod);
    }
    setName(''); setPrice(''); setImageUri(null);
    loadData();
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    loadData();
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setCategoryId(product.categoryId);
    setImageUri(product.img);
  };

  const handleSearch = async () => {
    if (searchKeyword.trim()) {
      const res = await searchProducts(searchKeyword.trim());
      setProducts(res);
    } else {
      loadData();
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Tìm kiếm sản phẩm hoặc loại"
        style={styles.input}
        value={searchKeyword}
        onChangeText={setSearchKeyword}
      />
      <Button title="Tìm" onPress={handleSearch} />

      <TextInput placeholder="Tên sản phẩm" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Giá" style={styles.input} keyboardType="numeric" value={price} onChangeText={setPrice} />

      <RNPickerSelect
        onValueChange={(value) => setCategoryId(value)}
        items={categories.map((c) => ({ label: c.name, value: c.id }))}
        value={categoryId}
        style={{ inputAndroid: styles.input, inputIOS: styles.input }}
      />

      <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
        <Text style={styles.buttonText}>{imageUri ? 'Chọn lại hình ảnh' : 'Chọn hình ảnh'}</Text>
      </TouchableOpacity>

      {imageUri && <Image source={getImageSource(imageUri)} style={styles.selectedImage} />}

      <Button title={editingId ? 'Cập nhật' : 'Thêm'} onPress={handleAddOrUpdate} />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={getImageSource(item.img)} style={styles.selectedImage} />
            <Text>{item.name} - {item.price.toLocaleString()} đ</Text>
            <View style={{ flexDirection: 'row' }}>
              <Button title="Sửa" onPress={() => handleEdit(item)} />
              <Button title="Xóa" onPress={() => handleDelete(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40, borderWidth: 1, borderColor: '#aaa',
    borderRadius: 6, paddingHorizontal: 10, marginBottom: 10,
  },
  imagePicker: {
    backgroundColor: '#007AFF', padding: 10, borderRadius: 6, marginBottom: 10, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  selectedImage: { width: 100, height: 100, marginBottom: 10 },
  card: {
    padding: 10, marginVertical: 6, backgroundColor: '#f2f2f2', borderRadius: 6,
  }
});

export default Sanpham;