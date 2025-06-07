import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Alert, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProductDatabase, { Category } from '../ProductDatabase';
import { RootStackParamList } from '../AppNavigatorProduct';

type CategoryManagementScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CategoryManagementScreen'>;

const CategoryManagementScreen = () => {
  const navigation = useNavigation<CategoryManagementScreenNavigationProp>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'hasProducts' | 'noProducts'>('all');
  const [productsCount, setProductsCount] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      loadProductsCount();
    }
  }, [categories]);

  useEffect(() => {
    filterCategories();
  }, [categories, filterType, productsCount]);

  const loadCategories = async () => {
    try {
      const catList = await ProductDatabase.getCategories();
      console.log('Loaded categories:', catList); // Debug
      setCategories(catList);
    } catch (e) {
      console.error('Error loading categories:', e);
      Alert.alert('Lỗi', 'Không thể tải danh sách danh mục');
    }
  };

  const loadProductsCount = async () => {
    try {
      const products = await ProductDatabase.getProducts();
      console.log('Loaded products:', products); // Debug
      const count: { [key: number]: number } = {};
      categories.forEach(category => {
        const productCount = products.filter(p => p.categoryId === category.id).length;
        count[category.id] = productCount;
        console.log(`Category ${category.id} (${category.name}): ${productCount} products`); // Debug
      });
      setProductsCount(count);
    } catch (e) {
      console.error('Error loading products count:', e);
      Alert.alert('Lỗi', 'Không thể tải số lượng sản phẩm');
    }
  };

  const filterCategories = () => {
    console.log('Filtering with productsCount:', productsCount); // Debug
    if (filterType === 'hasProducts') {
      setFilteredCategories(categories.filter(c => (productsCount[c.id] || 0) > 0));
    } else if (filterType === 'noProducts') {
      setFilteredCategories(categories.filter(c => (productsCount[c.id] || 0) === 0));
    } else {
      setFilteredCategories(categories);
    }
  };

  const onDeleteCategory = async (id: number) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa danh mục này? Các sản phẩm liên quan cũng sẽ bị xóa.', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await ProductDatabase.deleteCategory(id);
            Alert.alert('Thông báo', 'Xóa danh mục thành công');
            loadCategories();
          } catch (e) {
            console.error('Error deleting category:', e);
            Alert.alert('Thông báo', 'Xóa danh mục thất bại');
          }
        },
      },
    ]);
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerText, styles.idColumn]}>ID</Text>
      <Text style={[styles.headerText, styles.nameColumn]}>Tên</Text>
      <Text style={[styles.headerText, styles.iconColumn]}>Icon</Text>
      <Text style={[styles.headerText, styles.colorColumn]}>Màu</Text>
      <Text style={[styles.headerText, styles.actionsColumn]}>Thao tác</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản Lý Danh Mục</Text>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'all' && styles.activeFilter]}
          onPress={() => setFilterType('all')}
        >
          <Text style={styles.buttonText}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'hasProducts' && styles.activeFilter]}
          onPress={() => setFilterType('hasProducts')}
        >
          <Text style={styles.buttonText}>Có Sản Phẩm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'noProducts' && styles.activeFilter]}
          onPress={() => setFilterType('noProducts')}
        >
          <Text style={styles.buttonText}>Không Có Sản Phẩm</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal>
        <View style={{ minWidth: 600 }}>
          {renderHeader()}
          <FlatList
            data={filteredCategories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Text style={[styles.cell, styles.idColumn, styles.cellText]}>{item.id}</Text>
                <Text style={[styles.cell, styles.nameColumn, styles.cellText]}>{item.name}</Text>
                <Text style={[styles.cell, styles.iconColumn, styles.cellText]}>{item.icon}</Text>
                <View style={[styles.cell, styles.colorColumn]}>
                  <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                  <Text style={styles.cellText}>{item.color}</Text>
                </View>
                <View style={[styles.cell, styles.actionsColumn, styles.actionsCell]}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditCategoryScreen', { category: item })}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.buttonText}>Sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDeleteCategory(item.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.buttonText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddCategoryScreen')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Thêm Danh Mục</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#4DB6AC',
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 8,
  },
  activeFilter: {
    backgroundColor: '#00796B',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  idColumn: {
    width: 60,
  },
  nameColumn: {
    width: 150,
  },
  iconColumn: {
    width: 150,
  },
  colorColumn: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsColumn: {
    width: 140,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  cellText: {
    fontSize: 14,
    color: '#333',
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
    marginTop: 16,
    elevation: 5,
    shadowColor: '#4DB6AC',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default CategoryManagementScreen;