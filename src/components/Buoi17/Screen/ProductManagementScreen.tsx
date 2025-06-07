import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProductDatabase, { Product, Category } from '../ProductDatabase';
import { RootStackParamList } from '../AppNavigatorProduct';

type ProductManagementScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductManagementScreen'>;

const formatPrice = (price: string | number): string => {
  const numPrice = Number(price);
  if (isNaN(numPrice)) return '0 ₫';
  return numPrice.toLocaleString('vi-VN') + ' ₫';
};

const ProductManagementScreen = () => {
  const navigation = useNavigation<ProductManagementScreenNavigationProp>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, filterCategory]);

  const loadCategories = async () => {
    try {
      const catList = await ProductDatabase.getCategories();
      setCategories(catList);
    } catch (e) {
      console.error('Error loading categories:', e);
      Alert.alert('Lỗi', 'Không thể tải danh sách danh mục');
    }
  };

  const loadProducts = async () => {
    try {
      const prodList = await ProductDatabase.getProducts();
      setProducts(prodList);
    } catch (e) {
      console.error('Error loading products:', e);
      Alert.alert('Lỗi', 'Không thể tải danh sách sản phẩm');
    }
  };

  const filterProducts = () => {
    if (filterCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.categoryId.toString() === filterCategory));
    }
  };

  const onDeleteProduct = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa sản phẩm này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa sản phẩm',
        style: 'destructive',
        onPress: async () => {
          try {
            await ProductDatabase.deleteProduct(id);
            Alert.alert('Sản phẩm', 'Đã xóa thành công');
            loadProducts();
          } catch (e) {
            console.error('Error deleting product:', e);
            Alert.alert('Error', 'Xóa sản phẩm thất bại');
          }
        },
      },
    ]);
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerText, styles.imageColumn]}>Ảnh</Text>
      <Text style={[styles.headerText, styles.nameColumn]}>Product Name</Text>
      <Text style={[styles.headerText, styles.priceColumn]}>Price</Text>
      <Text style={[styles.headerText, styles.categoryColumn]}>Category</Text>
      <Text style={[styles.headerText, styles.actionsColumn]}>Thao tác</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý sản phẩm</Text>
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContainer}
        >
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterButton, filterCategory === 'all' && styles.activeFilter]}
              onPress={() => setFilterCategory('all')}
            >
              <Text style={styles.buttonText}>All</Text>
            </TouchableOpacity>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[styles.filterButton, filterCategory === category.id.toString() && styles.activeFilter]}
                onPress={() => setFilterCategory(category.id.toString())}
              >
                <Text style={styles.buttonText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={styles.tableWrapper}>
        <ScrollView horizontal>
          <View style={styles.tableContainer}>
            {renderHeader()}
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const category = categories.find(c => c.id === item.categoryId);
                return (
                  <View style={styles.itemRow}>
                    <View style={[styles.cell, styles.imageColumn]}>
                      <Image
                        source={
                          item.image && item.image.startsWith('file://')
                            ? { uri: item.image }
                            : { uri: 'https://via.placeholder.com/50' }
                        }
                        style={styles.image}
                        onError={() => console.log(`Failed to load image for product ${item.name}`)}
                      />
                    </View>
                    <Text style={[styles.cell, styles.nameColumn, styles.cellText]}>{item.name}</Text>
                    <Text style={[styles.cell, styles.priceColumn, styles.cellText]}>{formatPrice(item.price)}</Text>
                    <Text style={[styles.cell, styles.categoryColumn, styles.cellText]}>
                      {category ? category.name : 'No category'}
                    </Text>
                    <View style={[styles.cell, styles.actionsColumn, styles.actionsCell]}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('EditProductScreen', { product: item })}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.buttonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => onDeleteProduct(item.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.buttonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProductScreen')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  filterWrapper: {
    height: 48,
    marginBottom: 12,
  },
  filterScrollContainer: {
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#4DB6AC',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  activeFilter: {
    backgroundColor: '#00796B',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  tableWrapper: {
    flex: 1,
    marginBottom: 12,
  },
  tableContainer: {
    minWidth: 700,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    backgroundColor: '#ffffff',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  imageColumn: {
    width: 60,
  },
  nameColumn: {
    width: 150,
  },
  priceColumn: {
    width: 100,
  },
  categoryColumn: {
    width: 120,
  },
  actionsColumn: {
    width: 140,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  cellText: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  editButton: {
    backgroundColor: '#4DB6AC',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButton: {
    backgroundColor: '#4DB6AC',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#4DB6AC',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
});

export default ProductManagementScreen;