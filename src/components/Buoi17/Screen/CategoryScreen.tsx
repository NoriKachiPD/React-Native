import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigatorProduct';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductDatabase, { Category } from '../ProductDatabase';
import BottomNavBar from '../BottomNavBar';

type NavigationPropType = NativeStackNavigationProp<RootStackParamList>;

const CategoryScreen = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await ProductDatabase.getCategories();
      setCategories(categories);
      setLoading(false);
    };
    fetchCategories();
  }, []);

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