import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigatorProduct';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>('default');
  const [sortModalVisible, setSortModalVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await ProductDatabase.getProducts();
        const filtered = allProducts.filter((p) => p.categoryId === categoryId);
        setProducts(filtered);
        setOriginalProducts(filtered);
      } catch (e) {
        console.error('Error fetching products:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  useEffect(() => {
    let sortedProducts = [...products];
    if (sortOption === 'default') {
      sortedProducts = [...originalProducts];
    } else {
      switch (sortOption) {
        case 'priceAsc':
          sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
          break;
        case 'priceDesc':
          sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
          break;
        case 'nameAsc':
          sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'nameDesc':
          sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
    }
    setProducts(sortedProducts);
  }, [sortOption, originalProducts]);

  const handleSortSelect = (option: string) => {
    setSortOption(option);
    setSortModalVisible(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#26A69A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Danh mục: {categoryName}</Text>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setSortModalVisible(true)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="sort" size={20} color="#FFFFFF" />
            <Text style={styles.sortButtonText}>Sắp xếp</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => navigation.navigate('ProductDetailScreen', { productId: item.id })}
              activeOpacity={0.85}
            >
              <Image
                source={{ uri: item.image || 'https://via.placeholder.com/80' }}
                style={styles.image}
                onError={() => console.log(`Failed to load image for ${item.name}`)}
              />
              <View style={styles.productInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{formatPrice(item.price)}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
        <Modal
          transparent={true}
          visible={sortModalVisible}
          animationType="fade"
          onRequestClose={() => setSortModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSortModalVisible(false)}
          >
            <View style={styles.sortModal}>
              <TouchableOpacity
                style={styles.sortOption}
                onPress={() => handleSortSelect('default')}
                activeOpacity={0.7}
              >
                <Text style={styles.sortOptionText}>Mặc định</Text>
                {sortOption === 'default' && (
                  <MaterialCommunityIcons name="check" size={20} color="#26A69A" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortOption}
                onPress={() => handleSortSelect('priceAsc')}
                activeOpacity={0.7}
              >
                <Text style={styles.sortOptionText}>Giá: Thấp đến Cao</Text>
                {sortOption === 'priceAsc' && (
                  <MaterialCommunityIcons name="check" size={20} color="#26A69A" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortOption}
                onPress={() => handleSortSelect('priceDesc')}
                activeOpacity={0.7}
              >
                <Text style={styles.sortOptionText}>Giá: Cao đến Thấp</Text>
                {sortOption === 'priceDesc' && (
                  <MaterialCommunityIcons name="check" size={20} color="#26A69A" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortOption}
                onPress={() => handleSortSelect('nameAsc')}
                activeOpacity={0.7}
              >
                <Text style={styles.sortOptionText}>Tên: A → Z</Text>
                {sortOption === 'nameAsc' && (
                  <MaterialCommunityIcons name="check" size={20} color="#26A69A" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortOption}
                onPress={() => handleSortSelect('nameDesc')}
                activeOpacity={0.7}
              >
                <Text style={styles.sortOptionText}>Tên: Z → A</Text>
                {sortOption === 'nameDesc' && (
                  <MaterialCommunityIcons name="check" size={20} color="#26A69A" />
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 19,
    fontWeight: '900',
    color: '#E91E63',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#26A69A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  sortButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFCA28',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#26A69A',
  },
  listContent: {
    paddingBottom: 20, // Giảm padding vì không có BottomNavBar
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  sortModal: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sortOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default ProductListScreen;