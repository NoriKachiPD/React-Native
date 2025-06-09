import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../AppNavigatorProduct';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductDatabase, { Category, Product } from '../ProductDatabase';

type NavigationPropType = NativeStackNavigationProp<RootStackParamList, 'SearchResultsScreen'>;
type RoutePropType = RouteProp<RootStackParamList, 'SearchResultsScreen'>;

type DataItem = 
  | { type: 'category'; item: Category }
  | { type: 'product'; item: Product }
  | { type: 'header'; title: string };

const SearchResultsScreen = () => {
  const navigation = useNavigation<NavigationPropType>();
  const route = useRoute<RoutePropType>();
  const { query } = route.params;
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [allCategories, allProducts] = await Promise.all([
        ProductDatabase.getCategories(),
        ProductDatabase.getProducts(),
      ]);
      const lowerQuery = query.toLowerCase();
      const filteredCategories = allCategories.filter((category) =>
        category.name.toLowerCase().includes(lowerQuery)
      );
      const filteredProducts = allProducts.filter((product) =>
        product.name.toLowerCase().includes(lowerQuery)
      );
      setCategories(filteredCategories);
      setProducts(filteredProducts);
      setLoading(false);
    };
    fetchData();
  }, [query]);

  const handlePress = (item: Category | Product) => {
    if ('categoryId' in item) {
      // Là Product
      navigation.navigate('ProductDetailScreen', { productId: item.id });
    } else {
      // Là Category
      navigation.navigate('ProductListScreen', { categoryId: item.id, categoryName: item.name });
    }
  };

  // Tạo danh sách dữ liệu gộp với `as const`
  const data: DataItem[] = [
    ...(categories.length > 0 ? [{ type: 'header', title: 'Danh Mục' } as const] : []),
    ...categories.map((item) => ({ type: 'category', item } as const)),
    ...(products.length > 0 ? [{ type: 'header', title: 'Sản Phẩm' } as const] : []),
    ...products.map((item) => ({ type: 'product', item } as const)),
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4DB6AC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kết Quả Tìm Kiếm: "{query}"</Text>
      <FlatList
        data={data}
        keyExtractor={(item, index) =>
          item.type === 'header' ? `h-${item.title}-${index}` : `${item.type}-${item.item.id}`
        }
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return <Text style={styles.sectionTitle}>{item.title}</Text>;
          } else if (item.type === 'category') {
            return (
              <TouchableOpacity
                style={[styles.card, { backgroundColor: item.item.color }]}
                onPress={() => handlePress(item.item)}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons
                  name={item.item.icon}
                  size={36}
                  color="#fff"
                  style={styles.icon}
                />
                <Text style={styles.cardText}>{item.item.name}</Text>
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() => handlePress(item.item)}
                activeOpacity={0.85}
              >
                <Image
                  source={{ uri: item.item.image || 'https://via.placeholder.com/80' }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.item.name}</Text>
                  <Text style={styles.productPrice}>{item.item.price} VNĐ</Text>
                </View>
              </TouchableOpacity>
            );
          }
        }}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.noResults}>Không tìm thấy kết quả nào</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginVertical: 20,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  cardText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 16,
  },
  icon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    padding: 8,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4DB6AC',
  },
  listContent: {
    paddingBottom: 20,
  },
  noResults: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SearchResultsScreen;