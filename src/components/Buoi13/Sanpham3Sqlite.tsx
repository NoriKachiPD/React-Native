import React, { useEffect, useState } from 'react';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './AppNavigatorProduct';
import {
  initDatabase,
  fetchCategories,
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  Product,
  Category,
  searchProducts,
} from './database';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Sanpham3Sqlite'>;

export default function Sanpham3Sqlite() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    initDatabase(() => {
      loadData();
    });
  }, []);

  const loadData = async () => {
    const prods = await fetchProducts();
    setProducts(prods.reverse());
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

  // Giúp chuyển img là đường dẫn hoặc tên file asset thành source hợp lệ cho <Image>
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
          <TouchableOpacity onPress={() => Alert.alert('Sửa', 'Chức năng sửa chưa được triển khai')}>
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
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 10 }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardInfo: {
    padding: 10,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  productPrice: {
    marginTop: 4,
    color: 'green',
    fontSize: 16,
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  icon: {
    fontSize: 22,
    marginRight: 20,
  },
});