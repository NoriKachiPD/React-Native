import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Alert, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProductDatabase, { Category } from '../ProductDatabase';
import { RootStackParamList } from '../AppNavigatorProduct';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

type CategoryManagementScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CategoryManagementScreen'>;

const CategoryManagementScreen = () => {
  const navigation = useNavigation<CategoryManagementScreenNavigationProp>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'hasProducts' | 'noProducts'>('all');
  const [productsCount, setProductsCount] = useState<{ [key: number]: number }>({});

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  );

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
      console.log('Loaded categories:', catList);
      setCategories(catList);
    } catch (e) {
      console.error('Error loading categories:', e);
      Alert.alert('Lỗi', 'Không thể tải danh sách danh mục');
    }
  };

  const loadProductsCount = async () => {
    try {
      const products = await ProductDatabase.getProducts();
      console.log('Loaded products:', products);
      const count: { [key: number]: number } = {};
      categories.forEach(category => {
        const productCount = products.filter(p => p.categoryId === category.id).length;
        count[category.id] = productCount;
        console.log(`Category ${category.id} (${category.name}): ${productCount} products`);
      });
      setProductsCount(count);
    } catch (e) {
      console.error('Error loading products count:', e);
      Alert.alert('Lỗi', 'Không thể tải số lượng sản phẩm');
    }
  };

  const filterCategories = () => {
    console.log('Filtering with productsCount:', productsCount);
    if (filterType === 'hasProducts') {
      setFilteredCategories(categories.filter(c => (productsCount[c.id] || 0) > 0));
    } else if (filterType === 'noProducts') {
      setFilteredCategories(categories.filter(c => (productsCount[c.id] || 0) === 0));
    } else {
      setFilteredCategories(categories);
    }
  };

  const onDeleteCategory = async (id: number) => {
    const category = categories.find(c => c.id === id);
    const productCount = productsCount[id] || 0;

    Alert.alert(
      'Xác nhận',
      `Bạn có chắc muốn xóa danh mục "${category?.name}"? ${productCount > 0 ? `${productCount} sản phẩm liên quan cũng sẽ bị xóa.` : 'Danh mục này không có sản phẩm.'}`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await ProductDatabase.deleteCategory(id);
              Alert.alert('Thông báo', 'Xóa danh mục và sản phẩm liên quan thành công');
              await loadCategories();
              await loadProductsCount();
            } catch (e) {
              console.error('Error deleting category:', e);
              Alert.alert('Lỗi', 'Xóa danh mục thất bại');
            }
          },
        },
      ]
    );
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
      <Text style={styles.title}>Quản lý danh mục</Text>
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContainer}
        >
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
              <Text style={styles.buttonText}>Có sản phẩm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'noProducts' && styles.activeFilter]}
              onPress={() => setFilterType('noProducts')}
            >
              <Text style={styles.buttonText}>Không có sản phẩm</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <View style={styles.tableWrapper}>
        <ScrollView horizontal>
          <View style={styles.tableContainer}>
            {renderHeader()}
            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <Text style={[styles.cell, styles.idColumn, styles.cellText]}>{item.id}</Text>
                  <Text style={[styles.cell, styles.nameColumn, styles.cellText]}>{item.name}</Text>
                  <Text style={[styles.cell, styles.iconColumn, styles.cellText]}>{item.icon}</Text>
                  <View style={[styles.cell, styles.colorColumn, styles.colorCell]}>
                    <View style={[styles.colorBox, { backgroundColor: item.color, borderColor: '#FFCA28' }]} />
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
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddCategoryScreen')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Thêm danh mục</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9', // Xanh pastel
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#E91E63', // Hồng phấn
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  filterWrapper: {
    height: 50,
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
    backgroundColor: '#26A69A', // Xanh ngọc
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#FFCA28', // Viền vàng
  },
  activeFilter: {
    backgroundColor: '#0288D1', // Xanh dương
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  tableWrapper: {
    flex: 1,
    marginBottom: 12,
  },
  tableContainer: {
    minWidth: 600,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F8E9', // Xanh pastel
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#E91E63', // Viền hồng
  },
  headerText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333333',
    textAlign: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
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
  },
  colorCell: {
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
    borderWidth: 1,
    borderColor: '#FFCA28', // Viền vàng
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
    backgroundColor: '#26A69A', // Xanh ngọc
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFCA28', // Viền vàng
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: '#FF5722', // Cam
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFCA28', // Viền vàng
    elevation: 3,
  },
  addButton: {
    backgroundColor: '#E91E63', // Hồng phấn
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: '#FFCA28', // Viền vàng
  },
});

export default CategoryManagementScreen;