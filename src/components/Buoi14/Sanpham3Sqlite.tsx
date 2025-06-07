import React, { useEffect, useState } from 'react';
import { Alert, View, Text, TouchableOpacity, Image, StyleSheet, FlatList, TextInput, Modal, Button, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { RootStackParamList } from './AppNavigatorProduct';
import { initDatabase, fetchCategories, fetchProducts, addProduct, updateProduct, deleteProduct, Product, Category, searchProducts, } from './database';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Sanpham3Sqlite'>;

export default function Sanpham3Sqlite() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    img: '1.jpg',
    categoryId: 1,
  });

  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    initDatabase(() => {
      loadData();
      loadCategories();
    });
  }, []);

  const loadData = async () => {
    const prods = await fetchProducts();
    setProducts(prods.reverse());
  };

  const loadCategories = async () => {
    const cats = await fetchCategories();
    setCategories(cats);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa sản phẩm này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await deleteProduct(id);
            loadData();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSearch = async () => {
    if (searchKeyword.trim() === '') {
      loadData();
    } else {
      const results = await searchProducts(searchKeyword);
      setProducts(results);
    }
  };

  const handleSave = async () => {
    const priceNumber = parseFloat(formData.price);
    if (!formData.name || isNaN(priceNumber)) {
      Alert.alert('Lỗi', 'Tên hoặc giá sản phẩm không hợp lệ');
      return;
    }

    const newProduct: Omit<Product, 'id'> = {
      name: formData.name,
      price: priceNumber,
      img: formData.img,
      categoryId: formData.categoryId,
    };

    if (editingProduct) {
      await updateProduct({ ...editingProduct, ...newProduct });
    } else {
      await addProduct(newProduct);
    }

    setModalVisible(false);
    setEditingProduct(null);
    resetForm();
    loadData();
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', img: '1.jpg', categoryId: 1 });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      img: product.img,
      categoryId: product.categoryId,
    });
    setModalVisible(true);
  };

  const getImageSource = (img: string) => {
    if (img.startsWith('file://')) {
      return { uri: img };
    }
    switch (img) {
      case '1.jpg':
        return require('../../Img/1.jpg');
      case '2.jpg':
        return require('../../Img/2.jpg');
      default:
        return require('../../Img/1.jpg');
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
        <Image source={getImageSource(item.img)} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.cardInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Text style={styles.icon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.icon}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm sản phẩm..."
        value={searchKeyword}
        onChangeText={setSearchKeyword}
        onSubmitEditing={handleSearch}
      />
      <Button title="➕ Thêm sản phẩm" onPress={() => setModalVisible(true)} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>
            {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
          </Text>
          <TextInput
            placeholder="Tên sản phẩm"
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          <TextInput
            placeholder="Giá sản phẩm"
            keyboardType="numeric"
            style={styles.input}
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
          />
          <Text>Chọn loại sản phẩm:</Text>
          <Picker
            selectedValue={formData.categoryId}
            onValueChange={(value: number) => setFormData({ ...formData, categoryId: value })}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <Button title="💾 Lưu" onPress={handleSave} />
            <View style={{ width: 20 }} />
            <Button
              title="❌ Hủy"
              onPress={() => {
                setModalVisible(false);
                setEditingProduct(null);
                resetForm();
              }}
              color="red"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f2f2f2',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: 'green',
    marginTop: 4,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  icon: {
    fontSize: 18,
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});