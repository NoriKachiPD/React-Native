import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../AppNavigatorProduct';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProductDatabase, { Product } from '../ProductDatabase';

type ProductListScreenRouteProp = RouteProp<RootStackParamList, 'ProductListScreen'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductListScreen'>;

const formatPrice = (price: string | number): string => {
  const numPrice = Number(price);
  if (isNaN(numPrice)) return '0 ₫';
  return numPrice.toLocaleString('vi-VN') + ' ₫';
};

const ProductListScreen = () => {
  const route = useRoute<ProductListScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { categoryId, categoryName } = route.params;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await ProductDatabase.getProducts();
        const filtered = allProducts.filter((p) => p.categoryId === categoryId);
        setProducts(filtered);
      } catch (e) {
        console.error('Error fetching products:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4DB6AC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh mục: {categoryName}</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetailScreen', { productId: item.id })}
          >
            <Image source={{ uri: item.image }} style={styles.image} onError={() => console.log(`Failed to load image for ${item.name}`)} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{formatPrice(item.price)}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16, color: '#333' },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: { width: 64, height: 64, borderRadius: 8 },
  name: { fontSize: 18, fontWeight: '600', color: '#333' },
  price: { fontSize: 16, color: '#888', marginTop: 4 },
});

export default ProductListScreen;