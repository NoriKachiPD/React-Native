import React from 'react';
import { ScrollView, Text, Image, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from './AppNavigatorProduct';

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen() {
  const route = useRoute<ProductDetailRouteProp>();
  const { product } = route.params;

  // Hàm getImageSource giống như trong Sanpham3Sqlite để đảm bảo hiển thị hình đúng
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={getImageSource(product.img)} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price.toLocaleString()} đ</Text>
      <Text style={styles.label}>Xem các sản phẩm khác:</Text>
      {/* Có thể thêm danh sách hoặc nội dung khác ở đây */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  price: {
    marginTop: 8,
    fontSize: 20,
    color: 'green',
  },
  label: {
    marginTop: 20,
    fontSize: 16,
    color: '#444',
  },
});