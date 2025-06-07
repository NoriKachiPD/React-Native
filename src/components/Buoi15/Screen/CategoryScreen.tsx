import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigatorProduct';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CategoryScreen'>;

// Chỉ định rõ các icon hợp lệ để tránh lỗi TypeScript
type ValidIconName = 'food' | 'cup-water' | 'food-drumstick' | 'glass-cocktail';

type Category = {
  name: string;
  color: string;
  icon: ValidIconName;
};

const categories: Category[] = [
  { name: 'Đồ ăn', color: '#FF6F61', icon: 'food' },
  { name: 'Nước uống', color: '#4DB6AC', icon: 'cup-water' },
  { name: 'Gà rán', color: '#FFA726', icon: 'food-drumstick' },
  { name: 'Trà sữa', color: '#BA68C8', icon: 'glass-cocktail' },
];

const CategoryScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = (category: string) => {
    navigation.navigate('ProductListScreen', { category });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: item.color }]}
            onPress={() => handlePress(item.name)}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name={item.icon} size={32} color="white" style={styles.icon} />
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  cardText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  icon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    padding: 6,
  },
});

export default CategoryScreen;