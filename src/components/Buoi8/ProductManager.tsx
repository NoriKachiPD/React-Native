import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Alert } from 'react-native';

type Product = {
  id: string;
  name: string;
  price: number;
  img: any;
};

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Áo sơ mi', price: 200000, img: require('../../Img/1.jpg') },
    { id: '2', name: 'Giày thể thao', price: 500000, img: require('../../Img/2.jpg') },
  ]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddOrEdit = () => {
    if (name === '' || price === '') return;

    if (editingId) {
      setProducts(products.map(p =>
        p.id === editingId ? { ...p, name, price: Number(price) } : p
      ));
      setEditingId(null);
    } else {
      const newProduct: Product = {
        id: Math.random().toString(),
        name,
        price: Number(price),
        img: require('../../Img/1.jpg'),
      };
      setProducts([...products, newProduct]);
    }

    setName('');
    setPrice('');
  };

  const handleEdit = (product: Product) => {
    setName(product.name);
    setPrice(product.price.toString());
    setEditingId(product.id);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Xác nhận xoá', 'Bạn có chắc chắn muốn xoá sản phẩm này?',
      [
        {
          text: 'Huỷ',
          style: 'cancel',
        },
        {
          text: 'Xoá',
          onPress: () => {
            setProducts(products.filter(p => p.id !== id));
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý sản phẩm</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Giá"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleAddOrEdit}>
        <Text style={styles.buttonText}>{editingId ? 'Cập nhật' : 'Thêm'}</Text>
      </TouchableOpacity>

      <ScrollView>
        {products.map(p => (
          <View key={p.id} style={styles.item}>
            <Image source={p.img} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{p.name}</Text>
              <Text>{p.price.toLocaleString()} đ</Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleEdit(p)}>
                  <Text>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(p.id)}>
                  <Text>❌</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ProductManager;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  input: { borderWidth: 1, padding: 8, marginBottom: 8, borderRadius: 6 },
  button: { backgroundColor: 'blue', padding: 10, borderRadius: 6, marginBottom: 12 },
  buttonText: { color: 'white', textAlign: 'center' },
  item: { flexDirection: 'row', marginBottom: 10, borderWidth: 1, padding: 6, borderRadius: 8 },
  image: { width: 60, height: 60, marginRight: 10 },
  name: { fontWeight: 'bold' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 4 }
});