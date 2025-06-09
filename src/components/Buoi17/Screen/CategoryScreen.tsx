import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigatorProduct';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductDatabase, { Category, Product } from '../ProductDatabase';
import BottomNavBar from '../BottomNavBar';

type NavigationPropType = NativeStackNavigationProp<RootStackParamList>;

const CategoryScreen = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<(Category | Product)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedCategories, fetchedProducts] = await Promise.all([
        ProductDatabase.getCategories(),
        ProductDatabase.getProducts(),
      ]);
      setCategories(fetchedCategories);
      setProducts(fetchedProducts);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filteredCategories = categories.filter((category) =>
      category.name.toLowerCase().includes(lowerQuery)
    );
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(lowerQuery)
    );
    setSearchResults([...filteredCategories, ...filteredProducts]);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    Keyboard.dismiss();
  };

  const handleResultPress = (item: Category | Product) => {
    Keyboard.dismiss();
    setSearchQuery('');
    setSearchResults([]);
    if ('categoryId' in item) {
      // Là Product
      navigation.navigate('ProductDetailScreen', { productId: item.id });
    } else {
      // Là Category
      navigation.navigate('ProductListScreen', { categoryId: item.id, categoryName: item.name });
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      Keyboard.dismiss();
      setSearchResults([]);
      navigation.navigate('SearchResultsScreen', { query: searchQuery });
    }
  };

  const handlePress = (category: Category) => {
    navigation.navigate('ProductListScreen', { categoryId: category.id, categoryName: category.name });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4DB6AC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={handleSearchSubmit} style={styles.searchIconContainer}>
          <MaterialCommunityIcons name="magnify" size={24} color="#666" style={styles.searchIcon} />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm danh mục hoặc sản phẩm..."
          value={searchQuery}
          onChangeText={handleSearch}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearIconContainer}>
            <MaterialCommunityIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => ('categoryId' in item ? `p-${item.id}` : `c-${item.id}`)}
          style={styles.dropdown}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleResultPress(item)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={'categoryId' in item ? 'package-variant' : item.icon}
                size={20}
                color="#333"
                style={styles.dropdownIcon}
              />
              <Text style={styles.dropdownText}>
                {'categoryId' in item ? item.name : `${item.name} (Danh mục)`}
              </Text>
            </TouchableOpacity>
          )}
          keyboardShouldPersistTaps="handled"
        />
      )}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: item.color }]}
            onPress={() => handlePress(item)}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name={item.icon} size={36} color="#fff" style={styles.icon} />
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={styles.title}>Danh Mục Sản Phẩm</Text>}
      />
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  searchIconContainer: {
    padding: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  clearIconContainer: {
    padding: 8,
    marginLeft: 8,
  },
  dropdown: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownIcon: {
    marginRight: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginVertical: 20,
    textAlign: 'center',
    paddingHorizontal: 16,
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
    marginBottom: 16,
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
  listContent: {
    paddingBottom: 60, // Space for BottomNavBar
  },
});

export default CategoryScreen;