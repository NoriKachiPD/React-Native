import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, Button } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../AppNavigatorProduct';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ProductListScreenRouteProp = RouteProp<RootStackParamList, 'ProductListScreen'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductListScreen'>;

type Product = {
  id: string;
  name: string;
  price: string;
  image: any;
};

type CategoryName = 'Đồ ăn' | 'Nước uống' | 'Gà rán' | 'Trà sữa';

const sampleProducts: Record<CategoryName, Product[]> = {
  'Đồ ăn': [
    { id: '1', name: 'Cơm gà', price: '35.000đ', image: require('../../../Img/ComGa.jpg') },
    { id: '2', name: 'Bún bò', price: '40.000đ', image: require('../../../Img/BunBo.jpg') },
  ],
  'Nước uống': [
    { id: '3', name: 'Pepsi', price: '10.000đ', image: require('../../../Img/Pepsi.jpg') },
    { id: '4', name: 'Trà đào', price: '15.000đ', image: require('../../../Img/TraDao.jpg') },
  ],
  'Gà rán': [
    { id: '5', name: 'Gà cay', price: '45.000đ', image: require('../../../Img/GaCay.jpg') },
    { id: '6', name: 'Gà BBQ', price: '50.000đ', image: require('../../../Img/GaBBQ.jpg') },
  ],
  'Trà sữa': [
    { id: '7', name: 'Trà sữa trân châu', price: '28.000đ', image: require('../../../Img/TraSuaTranChau.jpg') },
    { id: '8', name: 'Trà sữa matcha', price: '30.000đ', image: require('../../../Img/TraSuaMatcha.jpg') },
  ],
};

const ProductListScreen = () => {
  const route = useRoute<ProductListScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { category } = route.params;

  const products = sampleProducts[category as CategoryName] || [];

  const handleLogout = () => {
    navigation.replace('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Button title="Đăng xuất" onPress={handleLogout} color="#d32f2f" />
      <Text style={styles.title}>Danh mục: {category}</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={item.image} style={styles.image} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 2,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
});

export default ProductListScreen;